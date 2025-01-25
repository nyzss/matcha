import { MantineProvider } from "@mantine/core";
import { theme } from "~/lib/theme";
import AuthProvider from "./auth-provider";
import { Notifications } from "@mantine/notifications";
import SocketProvider from "./socket-provider";
import Location from "./location";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import * as amplitude from "@amplitude/analytics-browser";
import { useEffect } from "react";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (import.meta.env.VITE_AMPLITUDE_API_KEY) {
            amplitude.init(import.meta.env.VITE_AMPLITUDE_API_KEY, {
                autocapture: true,
            });
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={theme}>
                <AuthProvider>
                    <SocketProvider>{children}</SocketProvider>
                    <Location />
                </AuthProvider>
                <Notifications />
                {/* <NavigationProgress /> */}
            </MantineProvider>
        </QueryClientProvider>
    );
}
