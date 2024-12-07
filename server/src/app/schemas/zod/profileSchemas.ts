import { z } from "zod";
import {userGender, userSexualOrientation} from "../../types/member";

const GenderEnum = z.nativeEnum(userGender);

const SexualOrientationEnum = z.nativeEnum(userSexualOrientation);

export const userProfileSettings = z
    .object({
        username: z.string().min(3).max(24).optional(),
        gender: GenderEnum.optional(),
        biography: z.string().optional(),
        sexualOrientation: SexualOrientationEnum.optional(),
        tags: z.array(z.string()).optional(),
        pictures: z.array(z.string()).optional(),
    })
    .refine(
        (data) =>
            data.username !== undefined ||
            data.gender !== undefined ||
            data.biography !== undefined ||
            data.sexualOrientation !== undefined ||
            data.tags !== undefined ||
            data.pictures !== undefined,
        {
            message: "At least one field must be provided",
            path: [],
        }
    );
