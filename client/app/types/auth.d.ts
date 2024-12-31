type Gender = "Man" | "Woman" | "Beyond Binary";
type SexualPreferences = "Man" | "Woman" | "Both" | "Neither" | "Other";

interface IProfile {
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
    verified?: boolean;
}
