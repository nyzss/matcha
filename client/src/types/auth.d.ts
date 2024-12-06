export type Gender = "Man" | "Woman" | "Beyond Binary";
export type SexualPreferences = "Man" | "Woman" | "Both" | "Neither" | "Other";

export interface Profile {
    id: number;
    username: string;
    avatar: string | null;
    firstName: string;
    lastName: string;
    gender: Gender | null;
    biography: string | null;
    sexualOrientation: SexualPreferences | null;
    pictures: string[] | null;
    tags: string[] | null;
}
