import { z } from "zod";
import { userGender, userSexualOrientation } from "../../types/member";

export const GenderEnum = z.union([z.enum(userGender), z.literal("")]);

export const SexualOrientationEnum = z.union([
    z.enum(userSexualOrientation),
    z.literal(""),
]);

export const userProfileSettings = z
    .object({
        username: z
            .string()
            .regex(/^\w+$/, {
                message:
                    "Username must contain only letters, numbers, and underscores",
            })

            .min(2, { message: "Username must be at least 2 characters long" })
            .max(24, {
                message: "Username must be at most 24 characters long",
            }),
        gender: GenderEnum,
        biography: z.string().max(255, {
            message: "Biography must be at most 255 characters long",
        }),
        sexualOrientation: SexualOrientationEnum,
        tags: z.array(z.string()).max(10, {
            message: "You can only have up to 10 tags",
        }),
    })
    .partial()
    .refine(
        (data) => {
            for (const el in Object.values(data)) {
                if (el !== undefined) {
                    return true;
                }
                return false;
            }
        },
        {
            message: "At least one field must be provided",
            path: [],
        }
    );
