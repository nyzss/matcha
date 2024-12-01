export interface RegisterForm {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface LoginForm {
    username: string;
    password: string;
}

export interface AuthResult {
    user: {
        id: number;
        username: string;
        firstName: string;
        lastName: string;
    };
    accessToken: string;
    refreshToken: string;
}

declare module 'fastify' {
    interface FastifyRequest {
        user?: { id: string };
    }
    interface FastifyInstance {
        verifyAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}


