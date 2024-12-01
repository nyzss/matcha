import { FastifyReply, FastifyRequest } from 'fastify';

export async function loggerMiddleware(request: FastifyRequest, reply: FastifyReply) {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
}
