import { z } from "zod";

const messages = {
    username: {
        min: { message: "Username must be at least 2 characters long" },
        max: { message: "Username mustn't exceed 32 characters" },
    },
    email: {
        email: { message: "Invalid email address" },
    },
    firstName: {
        min: { message: "First name must be at least 2 characters long" },
        max: { message: "First name mustn't exceed 32 characters" },
    },
    lastName: {
        min: { message: "Last name must be at least 2 characters long" },
        max: { message: "Last name mustn't exceed 32 characters" },
    },
    password: {
        min: { message: "Password must be at least 6 characters long" },
        max: { message: "Password mustn't exceed 64 characters" },
    },
    confirmPassword: {
        invalid: { message: "Passwords do not match" },
    },

    biography: {
        max: { message: "Biography mustn't exceed 255 characters" },
    },
};

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
    sexualOrientation: z.union([z.enum(SEXUAL_PREFERENCES), z.literal("")]),
    biography: z.string().max(255, messages.biography.max),
    tags: z.array(z.string().max(32)).max(10),

    avatar: z
        .custom<File>()
        .refine((file) => file instanceof File, "Expected file")
        .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            "File size should be less than 8MB"
        )
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Invalid file type, only .jpeg, .jpg, .png, .webp files are allowed"
        ),

    pictures: z
        .array(z.custom<File>())
        .max(5)
        .refine(
            (files) => files.every((file) => file instanceof Blob || File),
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

export const userSchemaPartial = z.object({
    username: z
        .string()
        .regex(/^\w+$/, {
            message:
                "Username must contain only letters, numbers, and underscores",
        })
        .min(2, messages.username.min)
        .max(32, messages.username.max),
    firstName: z
        .string()
        .min(2, messages.firstName.min)
        .max(32, messages.firstName.max),
    lastName: z
        .string()
        .min(2, messages.lastName.min)
        .max(32, messages.lastName.max),
    email: z.string().email(messages.email.email),
});

export const registerSchema = z
    .object({
        ...userSchemaPartial.shape,
        birthDate: z
            .date({ message: "Please enter a valid birth date" })
            .max(
                new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
                {
                    message: "You must be at least 18 years old",
                }
            ),
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

export const userSchema = userSchemaPartial.merge(preferencesSchema).partial();

export const chatMessageSchema = z.string().max(1000);

export const filterSchema = z.object({
    ageMax: z.number().min(18).max(100),
    ageMin: z.number().min(18).max(100),
    fameRatingMax: z.number().min(0).max(50),
    fameRatingMin: z.number().min(0).max(50),
    location: z.number().min(10).max(100),
    tags: z.array(z.string().max(32)).max(10),
});
