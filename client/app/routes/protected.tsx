import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "~/contexts/auth-provider";
import AuthEvent from "~/lib/event";

export default function Protected() {
    const { logged, shouldOnboard } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!logged) {
            navigate("/login");
        } else if (shouldOnboard) {
            navigate("/onboarding");
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
