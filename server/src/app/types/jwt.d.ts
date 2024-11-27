import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export interface JwtPayload {
    id: string;
    email: string;
}

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        generateToken: (payload: JwtPayload) => string;
    }

    interface FastifyRequest {
        user?: JwtPayload;
    }
}

declare module 'fastify' {
    interface FastifyInstance {
        orm: ORM;
    }
}