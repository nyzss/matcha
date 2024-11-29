import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';

export default ((err: FastifyError, req: FastifyRequest, reply: FastifyReply) => {
    if (hasZodFastifySchemaValidationErrors(err)) {
           return reply.code(400).send({
            message: "Invalid request data",
            details: err.validation,
            statusCode: 400,
        });
    }
    console.log(err)

    return reply.code(err.statusCode || 500).send({
        message: err.message || "Internal Server Error",
        statusCode: err.statusCode || 500,
    });
});
