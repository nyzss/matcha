import { ILogin, IRegister } from "@/types/validation";
import { IProfile } from "@/types/auth";
import { notifications } from "@mantine/notifications";

export const BASE_URL = `/api/`;

export const fetcher = async (path: string, options?: RequestInit) => {
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
export const authLogin = async (user: ILogin): Promise<IProfile | null> => {
    try {
        const res = await fetcher("/auth/login", {
            method: "POST",
            body: JSON.stringify(user),
        });

        const json: IProfile = (await res?.json()).user;
        if (!res?.ok) throw new Error();
        return json;
    } catch {
        return null;
    }
};

/**
 * returns an object with the key being the field name and the value being the error message
 */
export const authRegister = async (
    user: IRegister
): Promise<
    (Partial<IRegister> & { birthDate?: string; error?: string }) | void
> => {
    try {
        const res = await fetcher("/auth/register", {
            method: "POST",
            body: JSON.stringify({
                ...user,
                birthDate: user.birthDate.toISOString().split("T")[0],
            }),
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

export const authLogout = async (): Promise<boolean> => {
    try {
        const res = await fetcher("auth/logout", {
            method: "POST",
            headers: {},
        });

        const data = await res?.json();
        if (!res?.ok) {
            throw new Error(data.error);
        }
        return true;
    } catch {
        return false;
    }
};

export const checkAuth = async (): Promise<IProfile | false> => {
    try {
        const res = await fetcher("/profile/@me");
        const data: IProfile = (await res?.json()).user;
        if (!res?.ok) {
            throw new Error();
        }
        return data;
    } catch {
        return false;
    }
};

export const getUser = async (id: string): Promise<IProfile | null> => {
    try {
        const res = await fetcher("/profile/" + id);

        if (!res?.ok) {
            throw new Error("Couldn't find user");
        }
        const json = await res?.json();
        return json.user;
    } catch {
        notifications.show({
            title: "An error occurred",
            message: "Couldn't find user",
            color: "red",
        });
        return null;
    }
};

export const updateUser = async (user: Partial<IProfile>) => {
    try {
        console.log(user);
        return true;
    } catch {
        console.error("An error occurred");
        return false;
    }
};

