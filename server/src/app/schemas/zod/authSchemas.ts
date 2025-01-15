import { z } from "zod";

export const loginSchema = z.object({
    username: z
        .string()
        .min(2, { message: "Username must be at least 2 characters long" })
        .max(24, { message: "Username must be at most 24 characters long" }),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(64, { message: "Password must be at most 64 characters long" }),
});

export const registerSchema = z.object({
    username: z
        .string()
        .regex(/^\w+$/, {
            message:
                "Username must contain only letters, numbers, and underscores",
        })
        .min(2, { message: "Username must be at least 2 characters long" })
        .max(24, { message: "Username must be at most 24 characters long" }),

    email: z.string().email({ message: "Email must be a valid email address" }),

    firstName: z
        .string()
        .min(2, { message: "First name must be at least 2 characters long" })
        .max(24, { message: "First name must be at most 24 characters long" }),

    lastName: z
        .string()
        .min(2, { message: "Last name must be at least 2 characters long" })
        .max(24, { message: "Last name must be at most 24 characters long" }),

    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Birth date must be a valid date",
    }),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(64, { message: "Password must be at most 64 characters long" }),
});
