import { Profile } from "@/types/auth";
import { fetcher } from "./api";

export const checkAuth = async (): Promise<Profile | false> => {
    try {
        const res = await fetcher("/profile/@me");

        const data: Profile = await res?.json();
        // if (!res?.ok) {
        // throw new Error();
        // }
        return data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return false;
    }
};
