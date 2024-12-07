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
            const user = await this.userService.getUserByUsername(username);

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


            //TODO: Make upload for pictures and avatar
            const user = await this.userService.updateProfile(userID, {
                username: form?.username,
                gender: form?.gender,
                biography: form?.biography,
                sexualOrientation: form?.sexualOrientation,
                tags: form?.tags,
            });

            console.log(user)

            return {
                user: user
            };

        } catch (error: Error | any) {
            return reply.status(500).send({ error: error?.message });
        }




        return request.user;
    }
}
