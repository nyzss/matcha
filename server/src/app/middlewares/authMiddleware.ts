import {FastifyRequest, FastifyReply, FastifyInstance} from 'fastify';
import {AuthService} from "../services/authService";
import {VerifyPayloadType} from "@fastify/jwt";
import fp from "fastify-plugin";
import {UserService} from "../services/userService";
import {userProfile} from "../types/member";
import {JwtPayload} from "../types/auth";
import {LocalisationService} from "../services/localisationService";
import {ResearchService} from "../services/researchService";

export class AuthMiddleware {
    private app: FastifyInstance;
    private authService: AuthService;
    private userService: UserService;
    private localisationService: LocalisationService;

    constructor(app: FastifyInstance) {
        this.app = app;
        this.authService = new AuthService(app);
        this.userService = new UserService(app);
        this.localisationService = new LocalisationService(app);
    }


    async verifyAuth(
        request: FastifyRequest,
        reply: FastifyReply
    ) {
        const cookies = request.cookies;

        if (!cookies.accessToken)
            return reply.status(401).send({ error: 'Unauthorized: No access token provided' });

        try {

            const verify: JwtPayload = await this.authService.verifyToken(cookies.accessToken);

            const user = await this.userService.getUserById(verify.id);

            request.user = user;
            await this.localisationService.updateUserLocation(user.id, "62.4.16.169")


            //test code

            const researchService = new ResearchService(this.app);

            const research = await researchService.getSuggestions(user.id);


            console.log(research)
        } catch (error) {
            return reply.status(401).send({ error: 'Unauthorized: Invalid or expired access token' });
        }
    }

}

