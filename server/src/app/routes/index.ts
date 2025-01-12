import { FastifyInstance } from 'fastify';
import authRoutes from './auth/authRoutes';
import profileRoutes from './user/profileRoutes';
import chatRoutes from "./chat/chatRoutes";
import researchRoutes from "./research/researchRoutes";
import imageRoutes from "./image/imageRoutes";

export default async (app: FastifyInstance) => {
    app.register(authRoutes, { prefix: '/auth' });
    app.register(profileRoutes, { prefix: '/profile' });
    app.register(chatRoutes, { prefix: '/conversation' });
    app.register(researchRoutes, { prefix: '/research' });
    app.register(imageRoutes, { prefix: '/image' });
};

