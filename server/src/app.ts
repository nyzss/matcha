import fastify, {FastifyError, FastifyReply, FastifyRequest} from 'fastify';
import routes from './app/routes';
import errorHandler from "./app/utils/errorHandler";
import { serializerCompiler, validatorCompiler, hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import customPostgresORM from "./app/plugins/ormPlugin";
import { userSchema, publicUserSchema } from "./app/schemas/orm/userSchemas";

// a décalé dans un fichier
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';

const buildApp = async () => {
    const app = fastify({ logger: false });

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.setErrorHandler(errorHandler);

    // a déplacé dans un fichier
    await app.register(fastifyJwt, {
        secret: 'dededede',
    });

    app.register(require('@fastify/cookie'), {
        secret: process.env.COOKIE_SECRET,
        hook: 'onRequest',
        parseOptions: {}
    })


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


    await app.orm.createTableWithRelations('profiles', publicUserSchema)
    await app.orm.createTableWithRelations('users', userSchema)



    return app;
};

export default buildApp;
