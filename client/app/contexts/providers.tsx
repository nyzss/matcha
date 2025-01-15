import { MantineProvider } from "@mantine/core";
import { theme } from "~/lib/theme";
import AuthProvider from "./auth-provider";
import { Notifications } from "@mantine/notifications";
import SocketProvider from "./socket-provider";
import Location from "./location";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <MantineProvider theme={theme}>
            <AuthProvider>
                <SocketProvider>{children}</SocketProvider>
                <Location />
            </AuthProvider>
            <Notifications />
            {/* <NavigationProgress /> */}
        </MantineProvider>
    );
}
