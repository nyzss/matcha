import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(24, { message: "Username must be at most 24 characters long" })
        .refine((val) => val.length > 0, { message: "Username is required" }),

    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(64, { message: "Password must be at most 64 characters long" })
        .refine((val) => val.length > 0, { message: "Password is required" }),
});

export const registerSchema = z.object({
    username: z.string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(24, { message: "Username must be at most 24 characters long" })
        .refine((val) => val.length > 0, { message: "Username is required" }),

    email: z.string()
        .email({ message: "Email must be a valid email address" })
        .refine((val) => val.length > 0, { message: "Email is required" }),

    firstName: z.string()
        .min(3, { message: "First name must be at least 3 characters long" })
        .max(24, { message: "First name must be at most 24 characters long" })
        .refine((val) => val.length > 0, { message: "First name is required" }),

    lastName: z.string()
        .min(3, { message: "Last name must be at least 3 characters long" })
        .max(24, { message: "Last name must be at most 24 characters long" })
        .refine((val) => val.length > 0, { message: "Last name is required" }),

    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(64, { message: "Password must be at most 64 characters long" })
        .refine((val) => val.length > 0, { message: "Password is required" }),
});
