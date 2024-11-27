import { FastifyPluginAsync } from 'fastify';
import { AuthController } from '../controllers/auth/authController';
import { loginSchema, registerSchema } from '../schemas/authSchemas';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
const authRoutes: FastifyPluginAsync = async (app) => {
    const authController = new AuthController();

    app.withTypeProvider<ZodTypeProvider>().post('/login', {
        schema: {
            body: loginSchema,
        },
    }, authController.login);
    app.withTypeProvider<ZodTypeProvider>().post('/register', {
        schema: {
            body: registerSchema,
        }
    }, authController.register);
};

export default authRoutes;