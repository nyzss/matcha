import { FastifyPluginAsync } from "fastify";
import { AuthController } from "../../controllers/auth/authController";
import { loginSchema, registerSchema } from "../../schemas/zod/authSchemas";
import { ZodTypeProvider } from "fastify-type-provider-zod";
const authRoutes: FastifyPluginAsync = async (app) => {
    const authController: AuthController = new AuthController(app);

    app.withTypeProvider<ZodTypeProvider>().post(
        "/login",
        {
            schema: {
                body: loginSchema,
            },
        },
        authController.login.bind(authController)
    );
    app.withTypeProvider<ZodTypeProvider>().post(
        "/register",
        {
            schema: {
                body: registerSchema,
            },
        },
        authController.register.bind(authController)
    );

    app.post("/logout", authController.logout.bind(authController));
};

export default authRoutes;
