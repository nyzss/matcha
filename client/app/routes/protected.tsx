import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "~/contexts/auth-provider";
import AuthEvent from "~/lib/event";

export default function Protected() {
    const { logged } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!logged) {
            navigate("/login");
        }
    }, [logged]);

    useEffect(() => {
        const authEvent = new AuthEvent();

        authEvent.subscribe((event) => {
            if (event.detail.authenticated === false) {
                navigate("/login");
            }
        });

        return () => {
            authEvent.unsubscribe();
        };
    }, []);

    return <Outlet />;
}
