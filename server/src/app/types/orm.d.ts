import { PoolConfig } from 'pg';

export type ColumnType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'date'
    | 'text'
    | 'json'

interface TableSchema {
    [key: string]: {
        type: ColumnType
        primary?: boolean
        unique?: boolean
        nullable?: boolean
        defaultValue?: any
    }
}




export interface OrmOptions {
    postgresConfig: PoolConfig;
}

export interface ORM {
    query(text: string, params?: any[]): Promise<any[]>;

    findAll(table: string): Promise<any[]>;

    findById(table: string, id: number | string): Promise<any[]>;

    create(table: string, data: Record<string, any>): Promise<any[]>;

    update(table: string, id: number | string, data: Record<string, any>): Promise<any[]>;

    delete(table: string, id: number | string): Promise<any[]>;

    transaction(queries: { text: string; params?: any[] }[]): Promise<any[]>;

    validateTableName(table: string): void;

    validateColumnName(column: string): void;

    createTable(tableName: string, schema: TableSchema): Promise<void>

    formatDefaultValue(value: any): string
}

declare module 'fastify' {
    interface FastifyInstance {
        orm: ORM;
    }
}
