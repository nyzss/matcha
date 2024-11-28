import fastify, {FastifyError, FastifyReply, FastifyRequest} from 'fastify';
import routes from './app/routes';
import plugins from "./app/plugins";
import errorHandler from "./app/utils/errorHandler";
import { serializerCompiler, validatorCompiler, hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";


const buildApp = async () => {
    const app = fastify({ logger: true });

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.setErrorHandler(errorHandler);

    app.register(routes);
    app.register(plugins);


    return app;
};

export default buildApp;
