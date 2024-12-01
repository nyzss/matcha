import { TLogin, TRegister } from "@/types/validation";

export const BASE_URL = "http://localhost:8000/";

export const fetcher = async (path: string, options: RequestInit) => {
    try {
        const res = await fetch(new URL(path, BASE_URL), {
            headers: {
                "Content-Type": "application/json",
            },
            ...options,
        });

        return res;
    } catch (error) {
        console.error(error);
    }
};

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
        const res = await fetcher("auth/register", {
            method: "POST",
            body: JSON.stringify(user),
        });

        const json = await res?.json();
        if (!res?.ok) {
            if (json && json.error) {
                const error = json.error.toLowerCase();
                if (error.includes("email")) {
                    return {
                        email: "Email is already taken",
                    };
                } else if (error.includes("username")) {
                    return {
                        username: "Username is already taken",
                    };
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
};
