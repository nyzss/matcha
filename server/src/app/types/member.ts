export enum userGender {
    MALE = 0,
    FEMALE = 1,
    OTHER = 2
}

export enum userSexualOrientation {
    HOMOSEXUAL = 0,
    HETEROSEXUAL = 1,
    BISEXUAL = 2,
    PANSEXUAL = 3,
}

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
    gender?: userGender,
    biography?: string,
    sexualOrientation?: userSexualOrientation,
    tags?: string[],
    pictures?: string[],
}

export interface userProfile {
    id: number;
    username: string;
    avatar: string | null;
    firstName: string;
    lastName: string;
    age: number;
    gender: userGender | null;
    biography: string | null;
    sexualOrientation: userSexualOrientation | null;
    pictures: string[];
    tags: string[];
}
