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
    age: number;
}

interface IOtherProfile extends IProfile {
    isConnected: boolean;
    isOnline: boolean;
    lastConnection: string;
    fameRating: number;
}

interface IMetadata {
    notifications: number;
    views: number;
    messages: number;
    privacy: { email: string };
}

type IAuth = IMetadata & {
    user: IProfile;
};
