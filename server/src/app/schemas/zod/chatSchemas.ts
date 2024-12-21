import {z} from "zod";

export const createChatSchema = z.object({
    userId: z.number(),
});

export const createMessageSchema = z.object({
    content: z.string().max(1000).min(1),
});