import { FastifyInstance } from 'fastify';
import authRoutes from './auth/authRoutes';
import profileRoutes from './user/profileRoutes';

export default async (app: FastifyInstance) => {


    // Auth routes
    app.register(authRoutes, { prefix: '/auth' });

    // Test code
    app.register(profileRoutes, { prefix: '/profile' });
};

