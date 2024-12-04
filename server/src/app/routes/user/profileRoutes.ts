import { FastifyPluginAsync } from "fastify";
import { ProfileController } from "../../controllers/user/profileController";

// Code de teste pour voir les decorators jwt
const authRoutes: FastifyPluginAsync = async (app) => {
    const profileController = new ProfileController();

    console.log(app.verifyAuth);

    app.get(
        "/@me",
        {
            preHandler: [app.verifyAuth],
        },
        profileController.getProfile
    );

    app.put(
        "/@me",
        {
            preHandler: [app.verifyAuth],
        },
        profileController.updateProfile
    );
};

export default authRoutes;
