import { z } from "zod";

// const messages = {
//     username: {
//         message: "Name must be at least 3 characters long",
//     },
// };

export const loginSchema = z.object({
    username: z.string().min(3).max(24),
    password: z.string().min(8).max(64),
});

export const registerSchema = z.object({
    username: z.string().min(3).max(24),
    email: z.string().email(),
    firstName: z.string().min(3).max(24),
    lastName: z.string().min(3).max(24),
    password: z.string().min(8).max(64),
});
