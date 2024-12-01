import {userProfile} from "./user";

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
    user: userProfile;
    accessToken: string;
    refreshToken: string;
}

export interface JwtPayload {
    id: number;
}

declare module 'fastify' {
    interface FastifyRequest {
        user?: userProfile;
    }
    interface FastifyInstance {
        verifyAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}


