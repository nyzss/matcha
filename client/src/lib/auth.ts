import { Profile } from "@/types/auth";
import { fetcher } from "./api";
import { useAuthStore } from "./store";

export const checkAuth = async (): Promise<Profile | false> => {
    try {
        const res = await fetcher("/profile/@me");
        const data: Profile = (await res?.json()).user;
        if (!res?.ok) {
            throw new Error();
        }
        return data;
    } catch {
        return false;
    }
};

export const refreshAuth = async () => {
    const data = await checkAuth();
    if (data) {
        useAuthStore.getState().connect();
        useAuthStore.getState().update(data);
    } else {
        useAuthStore.getState().clear();
    }
};

