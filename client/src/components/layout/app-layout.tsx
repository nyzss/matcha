"use client";

import {
    AppShell,
    AppShellResponsiveSize,
    Burger,
    Button,
    Flex,
    Group,
    TextInput,
    useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMoon, IconSearch, IconSun } from "@tabler/icons-react";
import { routes } from "./routes";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import UserBox from "./user-box";
import { useMemo } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();
    const logged: boolean = useAuthStore((state) => state.logged);
    const navbarAsideWidth: AppShellResponsiveSize = {
        base: 300,
        md: 300,
        lg: 300,
        xl: 550,
    };
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const shown = useMemo(() => {
        return routes.filter(
            (route) => route.auth === undefined || route.auth === logged
        );
    }, [logged]);

    return (
        <AppShell
            header={{
                height: { base: 50 },
            }}
            navbar={{
                width: navbarAsideWidth,
                breakpoint: "sm",
                collapsed: { mobile: !opened },
            }}
            aside={{
                width: navbarAsideWidth,
                breakpoint: "sm",
                collapsed: { desktop: false, mobile: true },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                    />
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <Flex h={"100%"}>
                    <Flex
                        ml={{
                            base: "0",
                            sm: "auto",
                        }}
                        direction={"column"}
                        w={{
                            base: "100%",
                            sm: "auto",
                        }}
                    >
                        <Flex direction={"column"} gap={"xs"}>
                            {shown.map((route) => (
                                <Button
                                    variant="subtle"
                                    size="xl"
                                    leftSection={route.icon}
                                    component={Link}
                                    href={route.link}
                                    key={route.name}
                                    justify="flex-start"
                                >
                                    {route.name}
                                </Button>
                            ))}
                        </Flex>
                        {logged && <UserBox />}
                    </Flex>
                </Flex>
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
            <AppShell.Aside p="md">
                <Flex h={"100%"} w="100%">
                    <Flex
                        mr={{
                            base: "0",
                            sm: "auto",
                        }}
                        direction={"column"}
                        gap={"md"}
                    >
                        <TextInput
                            leftSection={<IconSearch size={16} />}
                            leftSectionPointerEvents="none"
                            placeholder="Search"
                            width={"100%"}
                        />

                        <Button onClick={toggleColorScheme} variant="outline">
                            {colorScheme === "dark" ? (
                                <IconMoon />
                            ) : (
                                <IconSun />
                            )}
                        </Button>

                        {!logged && (
                            <Group
                                mt={{
                                    base: "auto",
                                }}
                            >
                                <Link href={"/login"}>
                                    <Button variant="light">Login</Button>
                                </Link>
                                <Link href={"/register"}>
                                    <Button>Register</Button>
                                </Link>
                            </Group>
                        )}
                    </Flex>
                </Flex>
            </AppShell.Aside>
        </AppShell>
    );
}
