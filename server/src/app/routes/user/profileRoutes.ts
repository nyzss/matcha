import { FastifyPluginAsync } from 'fastify';
import { ProfileController } from '../../controllers/user/profileController';

// Code de teste pour voir les decorators jwt
const authRoutes: FastifyPluginAsync = async (app) => {
    const profileController = new ProfileController();

    console.log(app.verifyAuth);

    app.post('/test', {
        preHandler: [app.verifyAuth],
    }, profileController.getProfile);

};

export default authRoutes;