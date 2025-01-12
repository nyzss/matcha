import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {ResearchService} from "../../services/researchService";
import {ResearchOptions} from "../../types/research";

export class ResearchController {
    private app: FastifyInstance;
    private reserchService: ResearchService;

    constructor(app: FastifyInstance) {
        this.app = app;
        this.reserchService = new ResearchService(app);
    }

    getResearch(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.user.id;

        return this.reserchService.getUserResearch(userId);
    }

    updateResearch(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = request.user.id;

            const options = request.body as ResearchOptions;

            return this.reserchService.updateUserResearch(userId, options);
        } catch (e: Error | any) {
            reply.status(400).send({message: e.message});
        }
    }
}
