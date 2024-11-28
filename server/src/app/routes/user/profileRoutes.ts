import { FastifyPluginAsync } from 'fastify';
import { ProfileController } from '../../controllers/user/profileController';

// Code de teste pour voir les decorators jwt
const authRoutes: FastifyPluginAsync = async (app) => {
    const profileController = new ProfileController();

    app.post('/profile', {
        // preHandler: [app.verifyJWT],
    }, profileController.getProfile);

};

export default authRoutes;