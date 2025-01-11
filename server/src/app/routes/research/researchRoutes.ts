import { FastifyPluginAsync } from "fastify";
import { ResearchController } from "../../controllers/research/researchController";
import {ZodTypeProvider} from "fastify-type-provider-zod";
import {registerSchema} from "../../schemas/zod/authSchemas";
import {userProfileSettings} from "../../schemas/zod/profileSchemas";
import {researchOptions} from "../../schemas/zod/researchSchemas";

const researchRoutes: FastifyPluginAsync = async (app) => {
    const researchController = new ResearchController(app);

    app.get(
        "/",
        {
            preHandler: [app.verifyAuth],
        },
        researchController.getResearch.bind(researchController)
    );

    app.put(
        "/",
        {
            preHandler: [app.verifyAuth],
            schema: {
                body: researchOptions,
            },
        },
        researchController.updateResearch.bind(researchController)
    );

    app.get(
        "/suggestion",
        {
            preHandler: [app.verifyAuth],
        },
        researchController.getSuggestions.bind(researchController)
    );

    app.post(
        "/suggestion/:id/accept",
        {
            preHandler: [app.verifyAuth],
        },
        researchController.acceptSuggestion.bind(researchController)
    );

    app.post(
        "/suggestion/:id/decline",
        {
            preHandler: [app.verifyAuth],
        },
        researchController.declineSuggestions.bind(researchController)
    );

};

export default researchRoutes;
