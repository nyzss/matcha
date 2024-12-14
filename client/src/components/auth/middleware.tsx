"use client";

import { refreshAuth } from "@/lib/auth";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Middleware({ isProtected, children } : {isProtected?: boolean, children?: React.ReactNode}) {
    const logged = useAuthStore(state => state.logged);
    const router = useRouter();

    useEffect(() => {
        refreshAuth();
        if (isProtected && !logged) {
            router.push("/login");
        }
    }, [isProtected, logged, router]);

    if (isProtected && logged) {
        return <>{children}</>;
    }

    return <></>;
}
