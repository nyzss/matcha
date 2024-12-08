import { FastifyPluginAsync } from "fastify";
import { ProfileController } from "../../controllers/user/profileController";
import {ZodTypeProvider} from "fastify-type-provider-zod";
import {registerSchema} from "../../schemas/zod/authSchemas";
import {userProfileSettings} from "../../schemas/zod/profileSchemas";

// Code de teste pour voir les decorators jwt
const authRoutes: FastifyPluginAsync = async (app) => {
    const profileController = new ProfileController(app);

    console.log(app.verifyAuth);

    app.get(
        "/@me",
        {
            preHandler: [app.verifyAuth],
        },
        profileController.getProfile.bind(profileController)
    );

    app.get(
        "/:username",
        {
            preHandler: [app.verifyAuth],
        },
        profileController.getProfile.bind(profileController)
    );

    app.withTypeProvider<ZodTypeProvider>().put(
        "/@me",
        {
            preHandler: [app.verifyAuth],
            schema: {
                body: userProfileSettings,
            },
        },
        profileController.updateProfile.bind(profileController)
    );
};

export default authRoutes;
