import { TLogin, TRegister } from "@/types/validation";

export const BASE_URL = "http://localhost:3000/api";

/**
 * returns an object with the key being the field name and the value being the error message
 */
export const authLogin = async (
    user: TLogin
): Promise<Partial<TLogin> | void> => {
    try {
        console.log(user);
        // return {
        //     username: "User not found!",
        // };
        return {
            username: "User not found!",
        };
    } catch (error) {
        console.error(error);
    }
};

/**
 * returns an object with the key being the field name and the value being the error message
 */
export const authRegister = async (
    user: TRegister
): Promise<Partial<TRegister> | void> => {
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
