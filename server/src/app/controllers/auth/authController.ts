import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import { AuthService } from '../../services/authService';
import {RegisterForm, AuthResult, LoginForm} from "../../types/auth";

export class AuthController {
    private app: FastifyInstance;
    private authService: AuthService;

    constructor(app: FastifyInstance) {
        this.app = app;
        this.authService = new AuthService(app);
    }

    async login(request: FastifyRequest, reply: FastifyReply) {
        const form = request.body as LoginForm;
        try {
            const result: AuthResult = await this.authService.login(form);

            return await reply.setCookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
                sameSite: 'strict'
            }).setCookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60,
                path: '/',
                sameSite: 'strict'
            }).send({
                user: {
                    id: result.user.id,
                }
            });
        } catch (error: Error | any) {

            console.log(error);
            reply.status(401).send({ error: error.message });
        }
    }
    async register(request: FastifyRequest, reply: FastifyReply) {
        const form = request.body as RegisterForm;
        try {
            const result: AuthResult = await this.authService.register(form);

            return await reply.setCookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
                sameSite: 'strict'
            }).setCookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60,
                path: '/',
                sameSite: 'strict'
            }).send({
                user: {
                    id: result.user.id,
                }
            });
        } catch (error: Error | any) {
            return reply.status(400).send({error: error.message});
        }
    }
}

