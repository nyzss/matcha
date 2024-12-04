"use client";

import { checkAuth } from "@/lib/auth";
import { useAuthStore } from "@/lib/store";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export default function Middleware() {
    const { clear, update } = useAuthStore(
        useShallow((state) => ({
            clear: state.clear,
            update: state.update,
        }))
    );

    useEffect(() => {
        const updateProfile = async () => {
            const data = await checkAuth();
            console.log("DATA: ", data);
            if (data) {
                update(data);
            } else {
                clear();
            }
        };

        updateProfile();
    }, [update, clear]);

    return <></>;
}
