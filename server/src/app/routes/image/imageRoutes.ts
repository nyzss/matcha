import { FastifyPluginAsync } from "fastify";
import {ZodTypeProvider} from "fastify-type-provider-zod";
import {registerSchema} from "../../schemas/zod/authSchemas";
import {userProfileSettings} from "../../schemas/zod/profileSchemas";
import {researchOptions} from "../../schemas/zod/researchSchemas";
import {ImageController} from "../../controllers/image/imageController";

const imageRoutes: FastifyPluginAsync = async (app) => {
    const imageController = new ImageController(app);

    app.get(
        "/:id",
        {
            preHandler: [app.verifyAuth],
        },
        imageController.getImage.bind(imageController)
    );

    app.delete(
        "/:id",
        {
            preHandler: [app.verifyAuth],
        },
        imageController.deleteImage.bind(imageController)
    );


};

export default imageRoutes;
