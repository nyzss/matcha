import { FastifyInstance } from 'fastify';
import jwtPlugin from "./jwtPlugin";
import customPostgresORM from "./ormPlugin";
export default async (app: FastifyInstance) => {


    // Auth routes
    app.register(jwtPlugin);

    app.register(customPostgresORM, {
        postgresConfig: {
            user: process.env.POSTGRES_USER,
            host: "localhost",
            database: process.env.POSTGRES_DB,
            password: process.env.POSTGRES_PASSWORD,
            port: 5432,
        }
    });
};

