import { MantineProvider } from "@mantine/core";
import { theme } from "~/lib/theme";
import AuthProvider from "./auth-provider";
import { Notifications } from "@mantine/notifications";
import SocketProvider from "./socket-provider";
import Onboarding from "./onboarding";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <MantineProvider theme={theme}>
            <AuthProvider>
                <SocketProvider>
                    <Onboarding />
                    {children}
                </SocketProvider>
            </AuthProvider>
            <Notifications />
            {/* <NavigationProgress /> */}
        </MantineProvider>
    );
}
