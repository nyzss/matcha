import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {ChatService} from "../../services/chatService";

export class ChatController {
    private app: FastifyInstance;
    private chatService: ChatService;

    constructor(app: FastifyInstance) {
        this.app = app;
        this.chatService = new ChatService(app);
    }

    async createConversation(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { userId } = request.body as { userId: number };
            const meId = request.user.id;

            const conversation = await this.chatService.createConversation(userId, meId);
            return conversation;
        } catch (error: Error | any) {
            return reply.status(500).send({ error: error?.message });
        }
    }

    async getConversation(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: number };
            const meId = request.user.id;

            const conversation = await this.chatService.getConversation(id, meId);
            return conversation
        } catch (error: Error | any) {
            return reply.status(500).send({ error: error?.message });
        }
    }

    async createMessage(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: number };
            const { content } = request.body as { content: string };
            const meId = request.user.id;

            const message = await this.chatService.createMessage(id, meId, content);
            return message;
        } catch (error: Error | any) {
            return reply.status(500).send({error: error?.message});
        }
    }

    async getMessages(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: number };
            const meId = request.user.id;

            const messages = await this.chatService.getMessages(id, meId);
            return messages;
        } catch (error: Error | any) {
            return reply.status(500).send({error: error?.message});
        }
    }

    async getConversations(request: FastifyRequest, reply: FastifyReply) {
        try {
            const meId = request.user.id;

            const conversations = await this.chatService.getConversations(meId);
            return conversations;
        } catch (error: Error | any) {
            return reply.status(500).send({error: error?.message});
        }
    }

}
