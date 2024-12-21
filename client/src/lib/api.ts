import { ILogin, IRegister } from "@/types/validation";
import { refreshAuth } from "./auth";
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
export const authLogin = async (
    user: ILogin
): Promise<(Partial<ILogin> & { error?: string }) | void> => {
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
    } finally {
        await refreshAuth();
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
    } finally {
        await refreshAuth();
    }
};

export const authLogout = async () => {
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
    } finally {
        await refreshAuth();
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

