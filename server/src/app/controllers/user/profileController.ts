import { FastifyReply, FastifyRequest } from "fastify";

export class ProfileController {
    async getProfile(request: FastifyRequest, reply: FastifyReply) {
        console.log(request.user);
        return request.user;
    }

    async updateProfile(request: FastifyRequest, reply: FastifyReply) {
        return { message: "Update Profile" };
    }
}
