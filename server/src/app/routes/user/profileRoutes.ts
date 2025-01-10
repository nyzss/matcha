import { FastifyPluginAsync } from "fastify";
import { ProfileController } from "../../controllers/user/profileController";
import {ZodTypeProvider} from "fastify-type-provider-zod";
import {registerSchema} from "../../schemas/zod/authSchemas";
import {userProfileSettings} from "../../schemas/zod/profileSchemas";

// Code de teste pour voir les decorators jwt
const authRoutes: FastifyPluginAsync = async (app) => {
    const profileController = new ProfileController(app);

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

    app.put(
        "/:username/like",
        {
            preHandler: [app.verifyAuth],
        },
        profileController.addProfileLike.bind(profileController)
    );


    app.put(
        "/:username/block",
        {
            preHandler: [app.verifyAuth],
        },
        profileController.addBlockProfile.bind(profileController)
    );

    app.put(
        "/:username/report",
        {
            preHandler: [app.verifyAuth],
        },
        profileController.addReportProfile.bind(profileController)
    );

    app.delete(
        "/:username/block",
        {
            preHandler: [app.verifyAuth],
        },
        profileController.removeBlockProfile.bind(profileController)
    );

    app.get(
        "/:username/like",
        {
            preHandler: [app.verifyAuth],
        },
        profileController.getProfileLike.bind(profileController)
    );

    app.delete(
        "/:username/like",
        {
            preHandler: [app.verifyAuth],
        },
        profileController.removeProfileLike.bind(profileController)
    );

    app.get(
        "/@me/block",
        {
            preHandler: [app.verifyAuth],
        },
        profileController.getBlockedProfile.bind(profileController)
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

    app.get(
        "/@me/view",
        {
            preHandler: [app.verifyAuth],
        },
        profileController.getProfilView.bind(profileController)
    );

    app.get(
        "/@me/notification",
        {
            preHandler: [app.verifyAuth],
        },
        profileController.getProfileNotification.bind(profileController)
    );
};

export default authRoutes;
