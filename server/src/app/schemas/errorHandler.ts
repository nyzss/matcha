import {FastifyError, FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import authRoutes from "../routes/authRoutes";
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'

export default ((err: FastifyError, req: FastifyRequest, reply: FastifyReply) => {
    if (hasZodFastifySchemaValidationErrors(err)) {
        return reply.code(400).send({
            message: err.validation[0].message,
            statusCode: 400,
        });
    }
});

