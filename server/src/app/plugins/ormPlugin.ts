import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { Pool, PoolConfig, QueryResult, PoolClient } from 'pg';
import { ColumnDefinition, ColumnType, ORM, OrmOptions, RelationType, TableSchema } from '../types/orm';

const customPostgresORM: FastifyPluginAsync<OrmOptions> = async (
    fastify: FastifyInstance,
    options: OrmOptions
) => {
    const poolConfig: PoolConfig = {
        ...options.postgresConfig,
        max: options.postgresConfig?.max ?? 10,
        idleTimeoutMillis: options.postgresConfig?.idleTimeoutMillis ?? 30000
    };

    const pool = new Pool(poolConfig);

    const mapTypeToPostgres = (type: ColumnType): string => {
        switch (type) {
            case 'string': return 'VARCHAR(255)';
            case 'number': return 'INTEGER';
            case 'boolean': return 'BOOLEAN';
            case 'date': return 'TIMESTAMP';
            case 'text': return 'TEXT';
            case 'json': return 'JSONB';
            default: return 'VARCHAR(255)';
        }
    };

    try {
        const client = await pool.connect();
        client.release();
        fastify.log.info('PostgreSQL connected successfully');
    } catch (err) {
        fastify.log.error('Failed to connect to PostgreSQL:', err);
        throw new Error(`Database connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    const orm: ORM = {
        formatDefaultValue: (value: any): string => {
            if (value === null) return 'NULL';
            if (value === 'CURRENT_TIMESTAMP') return 'CURRENT_TIMESTAMP';
            if (typeof value === 'string') return `'${value}'`;
            if (typeof value === 'boolean') return value ? 'true' : 'false';
            if (typeof value === 'number') return value.toString();
            if (value instanceof Date) return `'${value.toISOString()}'`;
            if (typeof value === 'object') return `'${JSON.stringify(value)}'`;
            return `'${value}'`;
        },

        async query(text: string, params?: any[]): Promise<any[]> {
            const client = await pool.connect();
            try {
                const result: QueryResult = await client.query(text, params);
                return result.rows;
            } catch (error: unknown) {
                fastify.log.error(`Query failed: ${text} - ${error instanceof Error ? error.message : 'Unknown error'}`);
                return [];
            } finally {
                client.release();
            }
        },

        async findAll(table: string): Promise<any[]> {
            this.validateTableName(table);
            return this.query(`SELECT * FROM ${table}`);
        },

        async findById(table: string, id: number | string): Promise<any[]> {
            this.validateTableName(table);
            return this.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
        },

        async create(table: string, data: Record<string, any>): Promise<any[]> {
            this.validateTableName(table);

            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([_, value]) => value !== undefined && value !== null)
            );

            const keys = Object.keys(filteredData);
            const values = Object.values(filteredData);

            const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

            const query = `
                INSERT INTO "${table}" (${keys.join(', ')}) 
                VALUES (${placeholders}) 
                RETURNING *
            `;

            try {
                console.log('Create Query:', query);
                console.log('Create Values:', values);

                const result = await this.query(query, values);

                if (!result || result.length === 0) {
                    throw new Error(`No rows were inserted into ${table}`);
                }

                return result;
            } catch (error) {
                console.error(`Error creating record in ${table}:`, error);
                throw error;
            }
        },

        async update(table: string, id: number | string, data: Record<string, any>): Promise<any[]> {
            this.validateTableName(table);
            const sets = Object.keys(data).map((key, i) => `${key} = $${i + 2}`).join(', ');
            const values = Object.values(data);
            const query = `UPDATE ${table} SET ${sets} WHERE id = $1 RETURNING *`;
            return this.query(query, [id, ...values]);
        },

        async delete(table: string, id: number | string): Promise<any[]> {
            this.validateTableName(table);
            return this.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
        },

        async transaction(queries: { text: string; params?: any[] }[]): Promise<any[]> {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                const results: any[] = [];

                for (const query of queries) {
                    const result: QueryResult = await client.query(query.text, query.params);
                    results.push(result.rows);
                }

                await client.query('COMMIT');
                return results;
            } catch (error: unknown) {
                await client.query('ROLLBACK');
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                fastify.log.error('Transaction failed:', errorMessage);
                throw new Error(`Transaction failed: ${errorMessage}`);
            } finally {
                client.release();
            }
        },

        validateTableName(table: string): void {
            const tableNameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
            if (!tableNameRegex.test(table)) {
                throw new Error(`Invalid table name: ${table}`);
            }
        },

        validateColumnName(columnName: string): void {
            const columnNameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
            if (!columnNameRegex.test(columnName)) {
                throw new Error(`Invalid column name: ${columnName}`);
            }
        },

        async createTable(tableName: string, schema: TableSchema): Promise<void> {
            this.validateTableName(tableName);

            const columns = Object.entries(schema).map(([columnName, columnDef]) => {
                this.validateColumnName(columnName);

                const type = mapTypeToPostgres(columnDef.type);
                const nullable = columnDef.nullable === false ? 'NOT NULL' : '';
                const unique = columnDef.unique ? 'UNIQUE' : '';
                const primaryKey = columnDef.primary ? 'PRIMARY KEY' : '';
                const defaultValue = columnDef.defaultValue
                    ? `DEFAULT ${this.formatDefaultValue(columnDef.defaultValue)}`
                    : '';

                if (columnDef.primary && !columnDef.defaultValue) {
                    return `"${columnName}" SERIAL ${nullable} ${unique} ${primaryKey}`.trim();
                }

                return `"${columnName}" ${type} ${nullable} ${unique} ${primaryKey} ${defaultValue}`.trim();
            });

            const createTableQuery = `CREATE TABLE IF NOT EXISTS "${tableName}" (${columns.join(',\n')})`;

            try {
                await this.query(createTableQuery);
                fastify.log.info(`Table "${tableName}" created successfully`);
            } catch (error) {
                fastify.log.error(`Failed to create table "${tableName}":`, error);
                throw error;
            }
        },

        async createTableWithRelations(tableName: string, schema: TableSchema): Promise<void> {
            console.log('Creating table with relations:', tableName);
            const createQueries: string[] = [];

            const columns = Object.entries(schema).map(([columnName, columnDef]) => {
                return this.buildBaseColumnDefinition(columnName, columnDef);
            });

            // First, create the base table
            const createTableQuery = `
        CREATE TABLE IF NOT EXISTS "${tableName}" (
            ${columns.join(',\n')}
        )
    `;
            await this.query(createTableQuery);

            // Then add foreign key constraints
            for (const [columnName, columnDef] of Object.entries(schema)) {
                if (columnDef.relation) {
                    const relationQuery = `
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.table_constraints
                    WHERE constraint_name = '${tableName}_${columnName}_fk'
                ) THEN
                    ALTER TABLE "${tableName}"
                    ADD CONSTRAINT "${tableName}_${columnName}_fk"
                    FOREIGN KEY ("${columnName}")
                    REFERENCES "${columnDef.relation.table}" ("${columnDef.relation.field}")
                    ON DELETE ${columnDef.relation.onDelete || 'SET NULL'}
                    ON UPDATE ${columnDef.relation.onUpdate || 'CASCADE'};
                END IF;
            END $$;
            `;

                    await this.query(relationQuery).catch((error: Error) => {
                        console.error(`Failed to add foreign key constraint for ${columnName}:`, error);
                        fastify.log.error(`Failed to add foreign key constraint for ${columnName}:`, error);
                    });
                }
            }

            fastify.log.info(`Table "${tableName}" created successfully with relations`);
        },

        buildBaseColumnDefinition(columnName: string, columnDef: ColumnDefinition): string {
            const type = mapTypeToPostgres(columnDef.type);
            const nullable = columnDef.nullable === false ? 'NOT NULL' : '';
            const unique = columnDef.unique ? 'UNIQUE' : '';
            const primaryKey = columnDef.primary ? 'PRIMARY KEY' : '';
            const defaultValue = columnDef.defaultValue
                ? `DEFAULT ${this.formatDefaultValue(columnDef.defaultValue)}`
                : '';

            if (columnDef.primary && !columnDef.defaultValue) {
                return `"${columnName}" SERIAL ${nullable} ${unique} ${primaryKey}`.trim();
            }

            return `"${columnName}" ${type} ${nullable} ${unique} ${primaryKey} ${defaultValue}`.trim();
        },

        async findWithRelations(
            table: string,
            relations?: {
                [relationName: string]: {
                    table: string;
                    type?: RelationType;
                }
            }
        ): Promise<any[]> {
            if (!relations) {
                return this.findAll(table);
            }

            const joins = Object.entries(relations).map(([alias, relationDef]) =>
                `LEFT JOIN "${relationDef.table}" AS "${alias}" ON "${table}"."${alias}_id" = "${alias}"."id"`
            ).join('\n');

            const selectColumns = [
                `"${table}".*`,
                ...Object.entries(relations).map(([alias]) =>
                    `"${alias}".*`
                )
            ].join(', ');

            const query = `SELECT ${selectColumns} FROM "${table}" ${joins}`;

            return this.query(query);
        }
    };

    fastify.decorate('orm', orm);

    fastify.addHook('onClose', async (instance) => {
        try {
            await pool.end();
        } catch (error) {
            instance.log.error('Error closing PostgreSQL pool:', error);
        }
    });
};

export default fp(customPostgresORM, {
    name: 'customPostgresORM',
    dependencies: []
});
