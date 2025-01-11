import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {ResearchService} from "../../services/researchService";
import {FilterOptions, ResearchOptions} from "../../types/research";

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


    getSuggestions(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = request.user.id;
            const query = request.query as {
                sortField?: string;
                sortOrder?: string;
                age?: string;
                fameRating?: string;
                location?: string;
                tags?: string;
            };

            const filterOptions: FilterOptions = {
                sort: query.sortField && query.sortOrder ? {
                    field: query.sortField as "age" | "location" | "fame_rating" | "common_tags",
                    order: query.sortOrder as "asc" | "desc"
                } : undefined,
                age: query.age ? Number(query.age) : undefined,
                fameRating: query.fameRating ? Number(query.fameRating) : undefined,
                location: query.location ? Number(query.location) : undefined,
                tags: query.tags ? query.tags.split(',') : undefined
            };

            return this.reserchService.getSuggestions(userId, filterOptions);
        } catch (e: Error | any) {
            reply.status(400).send({message: e.message});
        }
    }

    async acceptSuggestion(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = request.user.id;
            const {id} = request.params as { id: string };

            await this.reserchService.acceptSuggestion(userId, parseInt(id));

            return {success: true};
        } catch (e: Error | any) {
            reply.status(400).send({message: e.message});
        }
    }

    async declineSuggestions(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = request.user.id;
            const {id} = request.params as { id: string };

            await this.reserchService.declineSuggestion(userId, parseInt(id));

            return {success: true};
        } catch (e: Error | any) {
            reply.status(400).send({message: e.message});
        }
    }
}
