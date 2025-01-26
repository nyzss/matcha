import { useEffect } from "react";
import { updateUserLocation } from "~/lib/api";
import { useAuth } from "./auth-provider";

export default function Location() {
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;
        navigator.geolocation.getCurrentPosition(async (pos) => {
            await updateUserLocation(pos);
        });
    }, [user]);

    return <></>;
}
