import { useEffect } from "react";
import { useAuth } from "./auth-provider";
import { cleanUp, setup } from "~/lib/socket";

export default function SocketProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            setup();
        } else {
            cleanUp();
        }
        return () => {
            cleanUp();
        };
    }, [user]);

    return children;
}
