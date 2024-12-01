import {FastifyRequest, FastifyReply, FastifyInstance} from 'fastify';
import {AuthService} from "../services/authService";
import {VerifyPayloadType} from "@fastify/jwt";
import fp from "fastify-plugin";
import {UserService} from "../services/userService";

export class AuthMiddleware {
    private app: FastifyInstance;
    private authService: AuthService;
    private userService: UserService

    constructor(app: FastifyInstance) {
        this.app = app;
        this.authService = new AuthService(app);
        this.userService = new UserService(app);
    }


    async verifyAuth(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const cookies = request.cookies;

        if (!cookies.accessToken)
            return reply.status(401).send({ error: 'Unauthorized: No access token provided' });

        try {

            // a typé
            const verify = await this.authService.verifyToken(cookies.accessToken) as any;

            const user = await this.userService.getUserById(verify.id);

            request.user = user;
        } catch (error) {
            return reply.status(401).send({ error: 'Unauthorized: Invalid or expired access token' });
        }
    }

}

