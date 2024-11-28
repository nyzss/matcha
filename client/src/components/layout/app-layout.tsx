"use client";

import {
    AppShell,
    Burger,
    Button,
    Flex,
    Group,
    rem,
    TextInput,
    useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMoon, IconSearch, IconSun } from "@tabler/icons-react";
import { routes } from "./navigations";
import Link from "next/link";
import { RegisterModal } from "@/components/auth/register";
import { LoginModal } from "@/components/auth/login";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();

    const navbarAsideWidth = { base: 200, md: 200, lg: 400, xl: 650 };

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

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
                <Flex
                    direction={"column"}
                    align={{
                        base: "center",
                        md: "flex-end",
                    }}
                    justify={"flex-start"}
                    gap={"md"}
                >
                    {routes.map((route) => (
                        <Link href={route.link} key={route.name}>
                            <Button
                                variant="subtle"
                                size="lg"
                                leftSection={route.icon}
                            >
                                {route.name}
                            </Button>
                        </Link>
                    ))}
                </Flex>
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
            <AppShell.Aside p="md">
                <Flex
                    direction={"column"}
                    align={"flex-start"}
                    justify={"center"}
                    gap={"md"}
                >
                    <TextInput
                        leftSection={
                            <IconSearch
                                style={{ width: rem(16), height: rem(16) }}
                            />
                        }
                        leftSectionPointerEvents="none"
                        placeholder="Search"
                        width={"100%"}
                    />
                    <LoginModal />
                    <RegisterModal />

                    <Button onClick={toggleColorScheme} variant="outline">
                        {colorScheme === "dark" ? <IconMoon /> : <IconSun />}
                    </Button>
                </Flex>
            </AppShell.Aside>
        </AppShell>
    );
}
