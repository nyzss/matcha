import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { Pool, PoolConfig, QueryResult } from 'pg';
import { ORM, OrmOptions } from '../types/orm';

const customPostgresORM: FastifyPluginAsync<OrmOptions> = async (fastify: FastifyInstance, options: OrmOptions) => {
    const pool = new Pool(options.postgresConfig);

    await pool.connect()

    const orm: ORM = {
        async query(text: string, params?: any[]): Promise<any[]> {
            const client = await pool.connect();
            try {
                const result: QueryResult = await client.query(text, params);
                return result.rows;
            } finally {
                client.release();
            }
        },

        async findAll(table: string): Promise<any[]> {
            return this.query(`SELECT * FROM ${table}`);
        },

        async findById(table: string, id: number | string): Promise<any[]> {
            return this.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
        },

        async create(table: string, data: Record<string, any>): Promise<any[]> {
            const keys = Object.keys(data);
            const values = Object.values(data);
            const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
            const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
            return this.query(query, values);
        },

        async update(table: string, id: number | string, data: Record<string, any>): Promise<any[]> {
            const sets = Object.keys(data).map((key, i) => `${key} = $${i + 2}`).join(', ');
            const values = Object.values(data);
            const query = `UPDATE ${table} SET ${sets} WHERE id = $1 RETURNING *`;
            return this.query(query, [id, ...values]);
        },

        async delete(table: string, id: number | string): Promise<any[]> {
            return this.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
        }
    };

    fastify.decorate('orm', orm);

    fastify.addHook('onClose', (instance, done) => {
        pool.end().then(() => done()).catch(done);
    });
};

export default fp(customPostgresORM, {
    name: 'fastify-postgres-orm'
});