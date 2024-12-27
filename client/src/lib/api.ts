import { ILogin, IRegister, IUser } from "@/types/validation";
import { IProfile } from "@/types/auth";
import { notifications } from "@mantine/notifications";
import { FetchResult, IConversation, TMessageHistory } from "@/types/types";

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
): Promise<FetchResult<IProfile, Partial<ILogin>>> => {
    try {
        const res = await fetcher("/auth/login", {
            method: "POST",
            body: JSON.stringify(user),
        });

        const json = await res?.json();
        if (res?.ok) {
            return {
                success: true,
                data: json.user as IProfile,
            };
        }
        if (!res?.ok) throw new Error();
    } catch {
        return {
            success: false,
            data: { username: "", password: "Invalid username or password" },
        };
    }
    return {
        success: false,
        data: {},
    };
};

/**
 * returns an object with the key being the field name and the value being the error message
 */
export const authRegister = async (
    user: IRegister
): Promise<
    FetchResult<IProfile, Partial<IRegister> & { birthDate?: string }>
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
        if (res?.ok) {
            return {
                success: true,
                data: json.user as IProfile,
            };
        }
        if (!res?.ok) {
            if (json && json.error) {
                const error = json.error.toLowerCase();
                if (error.includes("email")) {
                    return {
                        success: false,
                        data: { email: "Email is already taken" },
                    };
                } else if (error.includes("username")) {
                    return {
                        success: false,
                        data: {
                            username: "Username is already taken",
                        },
                    };
                }
            }
            throw new Error("An error occurred");
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            data: {},
        };
    }
    return {
        success: false,
        data: {},
    };
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
        const data = await res?.json();
        if (!res?.ok) {
            throw new Error();
        }
        return data.user;
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

export const updateUser = async (
    user: Partial<IUser>
): Promise<FetchResult<IProfile, Partial<IUser>>> => {
    try {
        const res = await fetcher("/profile/@me", {
            method: "PUT",
            body: JSON.stringify(user),
        });

        const json = await res?.json();
        if (!res?.ok) {
            throw new Error();
        }

        return {
            success: true,
            data: json.user as IProfile,
        };
    } catch {
        console.error("An error occurred");
        return {
            success: false,
            data: {},
        };
    }
};

export const fetchAllConversations = async (): Promise<IConversation[]> => {
    try {
        const res = await fetcher("/conversation/@me");

        return (await res?.json()).conversations;
    } catch {
        // TODO: might wanna do a better error handling (or not lol)
        return [];
    }
};

export const fetchConversation = async (
    chatId: string
): Promise<IConversation> => {
    const res = await fetcher("/conversation/" + chatId);

    if (!res?.ok) {
        throw new Error("Couldn't find conversation");
    }
    return await res?.json();
};

export const fetchMessageHistory = async (
    chatId: string
): Promise<TMessageHistory> => {
    const res = await fetcher("/conversation/" + chatId + "/message");

    if (!res?.ok) {
        throw new Error("Couldn't find conversation");
    }
    return await res?.json();
};

export const mutateMessage = async (
    conversationId: string,
    content: string
) => {
    const res = await fetcher("/conversation/" + conversationId + "/message", {
        method: "POST",
        body: JSON.stringify({
            content,
        }),
    });

    if (!res?.ok) {
        throw new Error("Couldn't send message");
    }

    return await res?.json();
};
