import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {UserService} from "../../services/userService";
import {userProfileSettings} from "../../types/member";
import {ChatService} from "../../services/chatService";

export class ProfileController {
    private app: FastifyInstance;
    private userService: UserService;
    private chatService: ChatService;

    constructor(app: FastifyInstance) {
        this.app = app;
        this.userService = new UserService(app);
        this.chatService = new ChatService(app);
    }

    async getProfile(request: FastifyRequest, reply: FastifyReply) {
        if (request.url.endsWith("/@me"))
            return {
                user: request.user,
                notifications: (await this.userService.getNotifications(request.user.id)).total,
                views: (await this.userService.getViews(request.user.id)).total,
                messages: (await this.chatService.getUnreadMessagesCount(request.user.id)),
            };
        try {
            const { username } = request.params as { username: string };
            const user = await this.userService.getUserByUsername(username, request.user.id);

            if (await this.userService.isBlocked(user.id, request?.user?.id,))
                return reply.status(401).send({ error: "User not found" });

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

            // error if the username is the same as the one sent, we just remove it from the object
            if (form.username === request.user.username) {
                delete form.username;
            }

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

                return view;

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

            return await this.userService.setLike(user.id, request?.user?.id);
        } catch (error: Error | any) {
            return reply.status(404).send({ error: error.message });
        }
    }

    async removeProfileLike(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { username } = request.params as { username: string };
            const user = await this.userService.getUserByUsername(username);

            return await this.userService.deleteLike(user.id, request?.user?.id);
        } catch (error: Error | any) {
            return reply.status(404).send({ error: error.message });
        }
    }

    async getProfileLike(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { username } = request.params as { username: string };
            const user = await this.userService.getUserByUsername(username);

            return await this.userService.getLike(user.id, request?.user?.id);
        } catch (error: Error | any) {
            return reply.status(404).send({error: error.message});
        }
    }

    async addBlockProfile(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { username } = request.params as { username: string };
            const user = await this.userService.getUserByUsername(username);

            await this.userService.blockUser(user.id, request?.user?.id);

            return {message: "User blocked"};
        } catch (error: Error | any) {
            return reply.status(404).send({error: error.message});
        }
    }

    async removeBlockProfile(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { username } = request.params as { username: string };
            const user = await this.userService.getUserByUsername(username);

            await this.userService.unblockUser(user.id, request?.user?.id);

            return {message: "User unblocked"};
        } catch (error: Error | any) {
            return reply.status(404).send({error: error.message});
        }
    }

    async getBlockedProfile(request: FastifyRequest, reply: FastifyReply) {
        try {
            const blocked = await this.userService.getBlockedUsers(request?.user?.id);

            return blocked;
        } catch (error: Error | any) {
            return reply.status(404).send({error: error.message});
        }
    }

    async getProfileNotification(request: FastifyRequest, reply: FastifyReply) {
        try {
            const notifications = await this.userService.getNotifications(request?.user?.id, true);

            return notifications;
        } catch (error: Error | any) {
            return reply.status(404).send({error: error.message});
        }
    }
}
