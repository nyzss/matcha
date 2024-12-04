import { TLogin, TRegister } from "@/types/validation";

export const BASE_URL = `/api/`;
// export const BASE_URL = "http://localhost:8000/";

export const fetcher = async (path: string, options: RequestInit) => {
    if (path.startsWith("/")) {
        path = path.slice(1);
    }
    const url = `${BASE_URL}${path}`;
    try {
        const res = await fetch(url, {
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
): Promise<(Partial<TLogin> & { error?: string }) | void> => {
    try {
        const res = await fetcher("/auth/login", {
            method: "POST",
            body: JSON.stringify(user),
        });

        const json = await res?.json();

        if (!res?.ok) {
            if (json && json.error) {
                const error = json.error.toLowerCase();
                if (error.includes("username")) {
                    return {
                        username: "Invalid username or password.",
                    };
                }
            }
            console.log(json);
            throw new Error("An error occurred");
        }
    } catch (error) {
        console.error(error);
        return {
            error: "An error occurred",
        };
    }
};

/**
 * returns an object with the key being the field name and the value being the error message
 */
export const authRegister = async (
    user: TRegister
): Promise<(Partial<TRegister> & { error?: string }) | void> => {
    try {
        const res = await fetcher("/auth/register", {
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
            throw new Error("An error occurred");
        }
    } catch (error) {
        console.error(error);
        return {
            error: "An error occurred",
        };
    }
};
