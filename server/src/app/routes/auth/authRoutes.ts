import { FastifyPluginAsync } from "fastify";
import { AuthController } from "../../controllers/auth/authController";
import { loginSchema, registerSchema, resetPasswordSchema } from "../../schemas/zod/authSchemas";
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

    app.get("/verify-email", authController.verifyEmail.bind(authController));

    app.post("/reset-password",
        {
            schema: {
                body: resetPasswordSchema
            }
        }
        , authController.resetPassword.bind(authController));

    app.post("/create-reset-password", authController.createResetPassword.bind(authController));

    app.get("/check-reset-password", authController.checkResetPassword.bind(authController));

    app.post("/location",
        {
            preHandler: [app.verifyAuth]
        },
        authController.updateLocation.bind(authController)
    )
};

export default authRoutes;
