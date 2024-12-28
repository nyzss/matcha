import { MantineProvider } from "@mantine/core";
import { theme } from "~/lib/theme";
import AuthProvider from "./auth-provider";
import { Notifications } from "@mantine/notifications";
import SocketProvider from "./socket-provider";

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

    return (
        <MantineProvider theme={theme}>
            <AuthProvider>
                <SocketProvider>{children}</SocketProvider>
            </AuthProvider>
            <Notifications />
            {/* <NavigationProgress /> */}
        </MantineProvider>
    );
}
