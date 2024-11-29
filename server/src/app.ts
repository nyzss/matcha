import fastify, {FastifyError, FastifyReply, FastifyRequest} from 'fastify';
import routes from './app/routes';
import errorHandler from "./app/utils/errorHandler";
import { serializerCompiler, validatorCompiler, hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import jwtPlugin from "./app/plugins/jwtPlugin";
import customPostgresORM from "./app/plugins/ormPlugin";
import {userModels} from "./app/schemas/models/userModels";


const buildApp = async () => {
    const app = fastify({ logger: false });

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.setErrorHandler(errorHandler);

    await app.register(jwtPlugin);
    await app.register(customPostgresORM, {
        postgresConfig: {
            user: process.env.POSTGRES_USER,
            host: "localhost",
            database: process.env.POSTGRES_DB,
            password: process.env.POSTGRES_PASSWORD,
            port: 5432,
        }
    });
    await app.register(routes);


    await app.orm.createTable('users', userModels)


    return app;
};

export default buildApp;
