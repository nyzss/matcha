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
        min: { message: "Password must be at least 6 characters long" },
        max: { message: "Password mustn't exceed 64 characters" },
    },
    confirmPassword: {
        invalid: { message: "Passwords do not match" },
    },
};

export const loginSchema = z.object({
    username: z
        .string()
        .min(1, { message: "Username is required" })
        .max(1000, { message: "You cannot have a username that long!" }),
    password: z
        .string()
        .min(1, { message: "Password is required" })
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
            .min(6, messages.password.min)
            .max(64, messages.password.max),
        confirmPassword: z
            .string()
            .min(1, { message: "Confirm password is required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: messages.confirmPassword.invalid.message,
        path: ["confirmPassword"],
    });

// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILE_SIZE = 2 ** 23; // 8MB
export const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "image/avif",
    "image/heic",
    "image/heif",
];

export const GENDERS = ["Man", "Woman", "Beyond Binary"] as const;
export const SEXUAL_PREFERENCES = [
    "Man",
    "Woman",
    "Both",
    "Neither",
    "Other",
] as const;

export const preferencesSchema = z.object({
    gender: z.union([z.enum(GENDERS), z.literal("")]),
    sexualPreference: z.union([z.enum(SEXUAL_PREFERENCES), z.literal("")]),
    biography: z.string().max(500),
    tags: z.array(z.string().max(32)).max(10),
    pictures: z
        .array(z.custom<File>())
        .max(5)
        .min(1)
        .refine(
            (files) => files.every((file) => file instanceof File),
            "Expected file"
        )
        .refine(
            (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
            "File size should be less than 8MB"
        )
        .refine(
            (files) =>
                files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
            "Invalid file type, only .jpeg, .jpg, .png, .webp files are allowed"
        ),
});
