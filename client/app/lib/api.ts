import type { IFilter, ILogin, IRegister, IUser } from "~/types/validation";

export const BASE_URL =
    `${import.meta.env.VITE_BACKEND_API_URL}/api/` || "https://localhost/api/";

export const IMAGE_URL =
    `${import.meta.env.VITE_BACKEND_API_URL}/api/image` ||
    "https://localhost/api/image";

export const getImage = (path: string | null | undefined) => {
    if (!path) return;
    return `${IMAGE_URL}/${path}`;
};

export const fetcher = async (path: string, options?: RequestInit) => {
    if (path.startsWith("/")) {
        path = path.slice(1);
    }
    const url = `${BASE_URL}${path}`;
    const headers = new Headers(options?.headers);

    if (options?.body && !(options.body instanceof FormData))
        headers.append("Content-Type", "application/json");

    try {
        const res = await fetch(url, {
            headers,
            credentials: "include",
            ...options,
        });

        if (res.status === 401) {
            // store.set(userAtom, null);
            console.log("delogged");
        }

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

export const checkAuth = async (): Promise<IAuth | false> => {
    try {
        const res = await fetcher("/profile/@me");
        const data: IAuth = await res?.json();
        if (!res?.ok) {
            throw new Error();
        }
        return data;
    } catch {
        return false;
    }
};

export const getUser = async (
    username: string
): Promise<{ user: IProfile; liked: boolean } | null> => {
    const res = await fetcher("/profile/" + username);

    if (!res?.ok) {
        throw new Error("Couldn't find user");
    }
    const json: { user: IProfile; liked: boolean } = await res?.json();
    return json;
};

export const updateUser = async (
    user: Partial<IUser>
): Promise<FetchResult<IProfile, Partial<IUser>>> => {
    try {
        const form = new FormData();

        for (const key in user) {
            if (key === "tags") {
                form.append(key, JSON.stringify(user[key]));
            } else if (key === "pictures") {
                if (!user[key]) continue;
                for (const picture of user[key]) {
                    form.append(key, picture);
                }
            } else {
                form.append(key, user[key as keyof IUser] as string);
            }
        }

        const res = await fetcher("/profile/@me", {
            method: "PUT",
            body: form,
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

export const fetchAllConversations = async (
    userId: number
): Promise<IConversation[]> => {
    try {
        const res = await fetcher("/conversation/@me");

        const convs: IConversation[] = (await res?.json()).conversations;

        const computed = convs.map((conv) => {
            const filtered = conv.users.filter((user) => user.id !== userId);

            conv.users = filtered.length > 0 ? filtered : [conv.users[0]];
            return conv;
        });
        return computed;
    } catch {
        // TODO: might wanna do a better error handling (or not lol)
        return [];
    }
};

export const fetchConversation = async (
    chatId: string,
    userId: number
): Promise<IConversation> => {
    const res = await fetcher("/conversation/" + chatId);

    if (!res?.ok) {
        throw new Error("Couldn't find conversation");
    }
    const data: IConversation = await res?.json();
    const filtered = data.users.filter((user) => user.id !== userId);
    data.users = filtered.length > 0 ? filtered : [data.users[0]];

    return data;
};

export const fetchMessageHistory = async (
    chatId: string
): Promise<TMessageHistory> => {
    const res = await fetcher("/conversation/" + chatId + "/message");

    if (!res?.ok) {
        throw new Error("Couldn't find conversation");
    }

    const messageHistory: TMessageHistory = await res?.json();

    return {
        ...messageHistory,
        messages: messageHistory.messages.reverse(),
    };
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

export const mutateConversation = async (
    userId: string | number
): Promise<IConversation> => {
    const res = await fetcher("/conversation/create", {
        method: "POST",
        body: JSON.stringify({
            userId,
        }),
    });

    if (!res?.ok) {
        throw new Error("Couldn't create conversation");
    }

    return await res?.json();
};

export const verifyEmail = async (code: string): Promise<boolean> => {
    const res = await fetcher("/auth/verify-email?code=" + code, {
        method: "GET",
    });

    if (!res?.ok) {
        throw new Error("Couldn't verify email");
    }

    return res.ok;
};

export const updateReadConversation = async (convId: string) => {
    try {
        const res = await fetcher(`/conversation/${convId}/read`, {
            method: "PUT",
        });

        return await res?.json();
    } catch (error) {
        console.log("Couldn't update read status", error);
    }
};

export const updateUserLocation = async (data: GeolocationPosition) => {
    try {
        const res = await fetcher(`/auth/location`, {
            method: "POST",
            body: JSON.stringify({
                lat: data.coords.latitude,
                long: data.coords.longitude,
            }),
        });

        if (!res?.ok) {
            throw new Error("Couldn't update location");
        }
    } catch (error) {
        console.error("Couldn't update location", error);
    }
};

export const getSuggestions = async () => {
    const res = await fetcher("/research/suggestion", {
        method: "GET",
    });

    if (!res?.ok) {
        throw new Error("Couldn't fetch suggestions");
    }

    const data: { users: ISuggestionProfile[] } = await res?.json();

    return data;
};

export const getFilter = async (): IFilter => {
    const res = await fetcher("/research", {
        method: "GET",
    });

    if (!res?.ok) {
        throw new Error("Couldn't fetch filter");
    }

    const data: IFilter = await res?.json();

    return data;
};

export const updateFilter = async (filter: IFilter) => {
    const res = await fetcher("/research", {
        method: "PUT",
        body: JSON.stringify(filter),
    });

    if (!res?.ok) {
        throw new Error("Couldn't update filter");
    }

    const data: IFilter = await res?.json();

    return data;
};

export const matchUser = async (userId: string, matched: boolean) => {
    try {
        const res = await fetcher(
            `/research/suggestion/${userId}/${matched ? "accept" : "decline"}`,
            {
                method: "POST",
            }
        );

        if (!res?.ok) {
            throw new Error("Couldn't match user");
        }

        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Couldn't match user", error);
    }
};

export const getNotifications = async () => {
    const res = await fetcher("/profile/@me/notification", {
        method: "GET",
    });

    if (!res?.ok) {
        throw new Error("Couldn't fetch notifications");
    }

    const data: INotificationsList = await res.json();
    return data;
};

export const likeUser = async (username: string) => {
    const res = await fetcher(`/profile/${username}/like`, {
        method: "PUT",
    });

    if (!res?.ok) {
        throw new Error("Couldn't match user");
    }

    return await res?.json();
};

export const unLikeUser = async (username: string) => {
    const res = await fetcher(`/profile/${username}/like`, {
        method: "DELETE",
    });

    if (!res?.ok) {
        throw new Error("Couldn't unmatch user");
    }

    return await res?.json();
};
