import { TLogin, TRegister } from "@/types/validation";

export const BASE_URL = "http://localhost:3000/api";

export const authLogin = async (
    user: TLogin
): Promise<Partial<TLogin> | null> => {
    try {
        console.log(user);
        return {
            username: "User not found!",
        };
    } catch (error) {
        console.error(error);
    }
    return {};
};

export const authRegister = async (
    user: TRegister
): Promise<Partial<TRegister> | null> => {
    try {
        console.log(user);
        return {
            username: "Username is already taken",
        };
    } catch (error) {
        console.error(error);
    }
    return {};
};
