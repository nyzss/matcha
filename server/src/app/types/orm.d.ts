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
}

declare module 'fastify' {
    interface FastifyInstance {
        orm: ORM;
    }
}