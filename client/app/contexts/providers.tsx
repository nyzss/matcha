import { MantineProvider } from "@mantine/core";
import { theme } from "~/lib/theme";
import AuthProvider from "./auth-provider";
import { Notifications } from "@mantine/notifications";
import SocketProvider from "./socket-provider";
import Location from "./location";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
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
