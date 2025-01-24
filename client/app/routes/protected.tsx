import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "~/contexts/auth-provider";

export default function Protected() {
    const { logged } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!logged) {
            navigate("/login");
        }
    }, []);

    return <Outlet />;
}
