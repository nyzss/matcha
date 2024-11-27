import fastifyJwt from '@fastify/jwt';
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { JwtPayload } from "../types/jwt";


// Actuellement non fonctionnel petit teste pour voir si ça marche

export default async function jwtPlugin(app: FastifyInstance) {
    app.register(fastifyJwt, {
        secret: process.env.JWT_SECRET || 'test',
        sign: {
            expiresIn: '1h'
        }
    });

    app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify<JwtPayload>();
        } catch (err) {
            reply.status(401).send({
                statusCode: 401,
                message: 'Invalid or expired token'
            });
        }
    });

    app.decorate('generateToken', (payload: JwtPayload) => {
        return app.jwt.sign(payload);
    });
};