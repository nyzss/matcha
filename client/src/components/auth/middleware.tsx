"use client";

import { refreshAuth } from "@/lib/auth";
import { useEffect } from "react";

export default function Middleware() {
    useEffect(() => {
        refreshAuth();
    }, []);
    return <></>;
}
