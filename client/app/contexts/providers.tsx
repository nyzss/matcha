import { MantineProvider } from "@mantine/core";
import { theme } from "~/lib/theme";
import AuthProvider from "./auth-provider";
import { Notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { socket } from "~/socket/socket";
// import { NavigationProgress, nprogress } from "@mantine/nprogress";
// import { useNavigation } from "react-router";
// import { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
    // const navigation = useNavigation();

    // useEffect(() => {
    //     if (navigation.state === "idle") {
    //         nprogress.complete();
    //     } else {
    //         nprogress.start();
    //     }
    // }, [navigation.state]);

    useEffect(() => {
        socket.connect();
        console.log("Connecting to socket.io server");
        console.log(document.cookie);
        const onConnect = () => {
            console.log("Connected to socket.io server");
        };

        const onDisconnect = () => {
            console.log("Disconnected from socket.io server");
        };

        const onError = (error: Error) => {
            console.error("Socket.io error", error);
        };

        const catchAll = (eventName: string, args: any[]) => {
            console.log("Socket event: ", eventName, "\n", args);
        };

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("error", onError);

        socket.onAny(catchAll);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("error", onError);
        };
    }, []);

    return (
        <MantineProvider theme={theme}>
            <AuthProvider>{children}</AuthProvider>
            <Notifications />
            {/* <NavigationProgress /> */}
        </MantineProvider>
    );
}
