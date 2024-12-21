import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {UserService} from "../../services/userService";
import {userProfileSettings} from "../../types/member";

export class ProfileController {
    private app: FastifyInstance;
    private userService: UserService;

    constructor(app: FastifyInstance) {
        this.app = app;
        this.userService = new UserService(app);
    }

    async getProfile(request: FastifyRequest, reply: FastifyReply) {
        if (request.url.endsWith("/@me"))
            return {
                user: request.user,
            };
        try {
            const { username } = request.params as { username: string };
            const user = await this.userService.getUserByUsername(username, request.user.id);

            if (request?.user?.id !== user.id)
                await this.userService.addView(request?.user?.id, user.id);

            return {
                user: user,
            };
        } catch (error) {
            return reply.status(404).send({ error: "User not found" });
        }
    }

    async updateProfile(request: FastifyRequest, reply: FastifyReply) {
        const userID = request?.user?.id;

        if (!request.url.endsWith("/@me") || !userID)
            return reply.status(401).send({ error: "Unauthorized" });

        try {
            const form = request.body as userProfileSettings;

            const user = await this.userService.updateProfile(userID, {
                username: form?.username,
                gender: form?.gender,
                biography: form?.biography,
                sexualOrientation: form?.sexualOrientation,
                tags: form?.tags,
            });

            return {
                user: user
            };

        } catch (error: Error | any) {
            return reply.status(500).send({ error: error?.message });
        }
    }

    async getProfilView(request: FastifyRequest, reply: FastifyReply) {
        try {
            if (request.url.endsWith("/@me/view")) {

                const user = request.user;
                const view = await this.userService.getViews(user.id);

                return {
                    users: view.users,
                    view: view.view,
                };

            } else {
                throw new Error("Unauthorized");
            }
        } catch (error) {
            return reply.status(404).send({ error: "User not found" });
        }
    }


    async addProfileLike(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { username } = request.params as { username: string };
            const user = await this.userService.getUserByUsername(username);

            return await this.userService.setLike(request?.user?.id, user.id);
        } catch (error: Error | any) {
            return reply.status(404).send({ error: error.message });
        }
    }

    async removeProfileLike(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { username } = request.params as { username: string };
            const user = await this.userService.getUserByUsername(username);

            return await this.userService.deleteLike(request?.user?.id, user.id);
        } catch (error: Error | any) {
            return reply.status(404).send({ error: error.message });
        }
    }

    async getProfileLike(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { username } = request.params as { username: string };
            const user = await this.userService.getUserByUsername(username);

            return await this.userService.getLike(request?.user?.id, user.id);
        } catch (error: Error | any) {
            return reply.status(404).send({error: error.message});
        }
    }
}
