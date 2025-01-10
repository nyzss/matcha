import { z } from 'zod';


export const researchOptions = z.object({
    ageMax: z.number().nullable(),
    ageMin: z.number().min(18, { message: "Minimum age must be 18" }),
    fameRatingMax: z.number().nullable(),
    fameRatingMin: z.number().min(0, { message: "Minimum fame rating must be 0" }),
    location: z.number().min(10).max(100),
    tags: z.array(z.string()),
}).refine(data => {
    if (data.ageMin !== null && data.ageMax !== null && data.ageMin > data.ageMax) {
        return false;
    }
    if (data.fameRatingMin !== null && data.fameRatingMax !== null && data.fameRatingMin > data.fameRatingMax) {
        return false;
    }
    return true;
}, {
    message: "Minimum values cannot exceed maximum values",
    path: [],
});