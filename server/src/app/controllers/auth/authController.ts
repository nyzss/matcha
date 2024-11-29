import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import { AuthService } from '../../services/authService';
import { RegisterForm } from "../../types/auth";

export class AuthController {
    private app: FastifyInstance;
    private authService: AuthService;

    constructor(app: FastifyInstance) {
        this.app = app;
        this.authService = new AuthService(app);
    }

    async login(request: FastifyRequest, reply: FastifyReply) {
        const { email, password } = request.body as RegisterForm;
        try {
            const token = await this.authService.login(email, password);
            reply.send({ token });
        } catch (error: Error | any) {
            reply.status(401).send({ error: error.message });
        }
    }

    // Méthode pour s'enregistrer (register)
    async register(request: FastifyRequest, reply: FastifyReply) {
        const form = request.body as RegisterForm;
        try {
            const user = await this.authService.register(form);
            reply.send(user);
        } catch (error: Error | any) {
            reply.status(400).send({ error: error.message });
        }
    }
}

