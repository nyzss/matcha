import { FastifyPluginAsync } from "fastify";
import {ZodTypeProvider} from "fastify-type-provider-zod";
import {registerSchema} from "../../schemas/zod/authSchemas";
import {userProfileSettings} from "../../schemas/zod/profileSchemas";
import {ChatController} from "../../controllers/chat/chatController";
import {createChatSchema, createMessageSchema} from "../../schemas/zod/chatSchemas";

const chatRoutes: FastifyPluginAsync = async (app) => {
    const chatController = new ChatController(app);

    app.withTypeProvider<ZodTypeProvider>().post(
        "/create",
        {
            preHandler: [app.verifyAuth],
            schema: {
                body: createChatSchema,
            },
        },
        chatController.createConversation.bind(chatController)
    );

    app.withTypeProvider<ZodTypeProvider>().get(
        "/:id",
        {
            preHandler: [app.verifyAuth],
        },
        chatController.getConversation.bind(chatController)
    );

    app.withTypeProvider<ZodTypeProvider>().get(
        "/@me",
        {
            preHandler: [app.verifyAuth],
        },
        chatController.getConversations.bind(chatController)
    );


    app.withTypeProvider<ZodTypeProvider>().post(
        "/:id/message",
        {
            preHandler: [app.verifyAuth],
            schema: {
                body: createMessageSchema,
            },
        },
        chatController.createMessage.bind(chatController)
    );

    app.withTypeProvider<ZodTypeProvider>().get(
        "/:id/message",
        {
            preHandler: [app.verifyAuth],
        },
        chatController.getMessages.bind(chatController)
    );
};

export default chatRoutes;
