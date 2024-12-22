import { z } from "zod";
import { userGender, userSexualOrientation } from "../../types/member";

const GenderEnum = z.union([z.enum(userGender), z.literal("")]);

const SexualOrientationEnum = z.union([
    z.enum(userSexualOrientation),
    z.literal(""),
]);

export const userProfileSettings = z
    .object({
        username: z.string().min(3).max(24),
        gender: GenderEnum,
        biography: z.string(),
        sexualOrientation: SexualOrientationEnum,
        tags: z.array(z.string()),
        pictures: z.array(z.string()),
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
