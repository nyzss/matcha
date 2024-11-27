import { z } from "zod";

const messages = {
    username: {
        min: { message: "Username must be at least 3 characters long" },
        max: { message: "Username mustn't exceed 32 characters" },
    },
    email: {
        email: { message: "Invalid email address" },
    },
    firstName: {
        min: { message: "First name must be at least 3 characters long" },
        max: { message: "First name mustn't exceed 32 characters" },
    },
    lastName: {
        min: { message: "Last name must be at least 3 characters long" },
        max: { message: "Last name mustn't exceed 32 characters" },
    },
    password: {
        min: { message: "Password must be at least 8 characters long" },
        max: { message: "Password mustn't exceed 64 characters" },
    },
    confirmPassword: {
        invalid: { message: "Passwords do not match" },
    },
};

export const loginSchema = z.object({
    username: z
        .string()
        .max(1000, { message: "You cannot have a username that long!" }),
    password: z
        .string()
        .max(1000, { message: "You cannot have a password that long!" }),
});

export const registerSchema = z
    .object({
        username: z
            .string()
            .min(3, messages.username.min)
            .max(32, messages.username.max),
        firstName: z
            .string()
            .min(3, messages.firstName.min)
            .max(32, messages.firstName.max),
        lastName: z
            .string()
            .min(3, messages.lastName.min)
            .max(32, messages.lastName.max),
        email: z.string().email(messages.email.email),
        password: z
            .string()
            .min(8, messages.password.min)
            .max(64, messages.password.max),
        confirmPassword: z
            .string()
            .min(1, { message: "Confirm password is required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: messages.confirmPassword.invalid.message,
        path: ["confirmPassword"],
    });
