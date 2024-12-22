// export enum userGender {
//     MALE = 0,
//     FEMALE = 1,
//     OTHER = 2
// }

// export enum userSexualOrientation {
//     HOMOSEXUAL = 0,
//     HETEROSEXUAL = 1,
//     BISEXUAL = 2,
//     PANSEXUAL = 3,
// }

export const userGender = ["Man", "Woman", "Beyond Binary"] as const;
export const userSexualOrientation = [
    "Man",
    "Woman",
    "Both",
    "Neither",
    "Other",
] as const;

export type TUserGender = typeof userGender;
export type TUserSexualOrientation = typeof userSexualOrientation;

export interface userSettings {
    email: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    newPassword: string;
    oldPassword?: string;
}

export interface userProfileSettings {
    username?: string,
    gender?: TUserGender,
    biography?: string,
    sexualOrientation?: TUserSexualOrientation,
    tags?: string[],
    pictures?: string[],
}

export interface userProfile {
    id: number;
    username: string;
    avatar: string | null;
    firstName: string;
    lastName: string;
    isConnected?: boolean;
    age: number;
    gender: TUserGender | null;
    biography: string | null;
    sexualOrientation: TUserSexualOrientation | null;
    pictures: string[];
    tags: string[];
}

export interface userProfileLike {
    user?: userProfile;
    like: {
        me: boolean;
        count: number;
    },
}

export interface userProfileView {
    users: userProfile[];
    view: {
        count: number;
    },
}
