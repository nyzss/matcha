"use client";

import { useAuth } from "@/contexts/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { logged } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!logged) {
            router.push("/login");
        }
    }, [router, logged]);
    return children;
}
