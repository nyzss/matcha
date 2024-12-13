import fastify, {FastifyError, FastifyReply, FastifyRequest} from 'fastify';
import routes from './app/routes';
import errorHandler from "./app/utils/errorHandler";
import { serializerCompiler, validatorCompiler, hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import customPostgresORM from "./app/plugins/ormPlugin";
import customSocketManager from "./app/plugins/socketPlugin";
import {userSchema, publicUserSchema, viewSchema, likeSchema} from "./app/schemas/orm/userSchemas";

// a décalé dans un fichier
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from "@fastify/multipart";

import {loggerMiddleware} from "./app/middlewares/loggerMiddleware";
import {customMiddleware} from "./app/plugins/middlewarePlugin";

const buildApp = async () => {
    const app = fastify({ logger: true });

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.setErrorHandler(errorHandler);

    app.addHook('onRequest', loggerMiddleware);
    // a déplacé dans un fichier

    // allowing cors for frontend
    // await app.register(cors, {});

    await app.register(fastifyJwt, {
        secret: process.env.JWT_SECRET as string,
    });

    await app.register(fastifyCookie, {
        secret: process.env.COOKIE_SECRET,
        hook: 'onRequest',
        parseOptions: {}
    })

    await app.register(fastifyMultipart);

    await app.register(customPostgresORM, {
        postgresConfig: {
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: process.env.POSTGRES_DB,
            password: process.env.POSTGRES_PASSWORD,
            port: 5432,
        },
    });

    await app.register(customSocketManager, {
        secret: process.env.JWT_SECRET as string,
    });

    await app.register(customMiddleware);
    await app.register(routes, { prefix: "/api" });

    await app.orm.createTableWithRelations('users', userSchema)
    await app.orm.createTableWithRelations('profiles', publicUserSchema)
    await app.orm.createTableWithRelations('views', viewSchema)
    await app.orm.createTableWithRelations('likes', likeSchema)


    return app;
};

export default buildApp;
