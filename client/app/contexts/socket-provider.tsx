import { useEffect } from "react";
import { useAuth } from "./auth-provider";
import { cleanUp, setup } from "~/socket/socket";

export default function SocketProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { logged } = useAuth();

    useEffect(() => {
        if (logged) {
            setup();
        }
        return () => {
            cleanUp();
        };
    }, [logged]);

    return children;
}
