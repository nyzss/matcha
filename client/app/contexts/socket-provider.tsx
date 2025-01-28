import { useEffect } from "react";
import { useAuth } from "./auth-provider";
import { cleanUp, setup } from "~/lib/socket";

export default function SocketProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, updateNotifications } = useAuth();

    useEffect(() => {
        if (user) {
            setup(user, updateNotifications);
        } else {
            cleanUp();
        }
        return () => {
            cleanUp();
        };
    }, [user]);

    return children;
}
