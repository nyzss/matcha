import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {UserService} from "../../services/userService";
import {deleteFile, getImage, uploadFile} from "../../utils/mediaUtils";

export class ImageController {
    private app: FastifyInstance;
    private userService: UserService;

    constructor(app: FastifyInstance) {
        this.app = app;
        this.userService = new UserService(app);
    }

    async getImage(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };

            const image = await getImage(id);

            return reply.type("image/png").send(image);
        } catch (error) {
            return reply.status(404).send({ error: "Image not found" });
        }
    }

    async deleteImage(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };

            await this.userService.deleteProfileMedia(request.user.id, id);

            return { success: true };
        } catch (error) {
            return reply.status(404).send({ error: "Media not found or is not yours" });
        }
    }

}
