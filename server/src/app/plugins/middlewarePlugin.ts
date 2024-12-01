import {FastifyRequest, FastifyReply, FastifyInstance} from 'fastify';
import {AuthService} from "../services/authService";
import {VerifyPayloadType} from "@fastify/jwt";
import fp from "fastify-plugin";
import {AuthMiddleware} from "../middlewares/authMiddleware";

export async function customMiddleware(
    fastify: FastifyInstance,
) {

    const authMiddleware = new AuthMiddleware(fastify);

    fastify.decorate('verifyAuth', authMiddleware.verifyAuth.bind(authMiddleware));
}

export default fp(customMiddleware, {
    name: 'customMiddleware',
    dependencies: []
});