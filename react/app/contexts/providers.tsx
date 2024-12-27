import { MantineProvider } from "@mantine/core";
import { theme } from "~/lib/theme";
import AuthProvider from "./auth-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <MantineProvider theme={theme}>
            <AuthProvider>{children}</AuthProvider>
        </MantineProvider>
    );
}
