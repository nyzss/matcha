import type { Metadata } from "next";
import localFont from "next/font/local";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import RouterTransition from "@/components/layout/navigation-progress";
import { Notifications } from "@mantine/notifications";
import { theme } from "@/lib/theme";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import AuthProvider from "@/contexts/auth-provider";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "matcha",
    description: "Find your perfect match",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ColorSchemeScript />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <MantineProvider theme={theme}>
                    <AuthProvider>
                        <RouterTransition />
                        <Notifications />
                        {children}
                    </AuthProvider>
                </MantineProvider>
            </body>
        </html>
    );
}
