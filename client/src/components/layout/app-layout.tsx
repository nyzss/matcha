"use client";

import {
    ActionIcon,
    AppShell,
    AppShellResponsiveSize,
    Box,
    Burger,
    Button,
    Flex,
    Group,
    Text,
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

    const navbarAsideWidth: AppShellResponsiveSize = {
        base: 300,
        md: 300,
        lg: 300,
        xl: 650,
    };

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
                            {routes.map((route) => (
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
                        <Box style={{ marginTop: "auto" }}>
                            <Flex align="center" mt="xl">
                                <Box mr="xs">
                                    <Text size="sm" fw={700}>
                                        Matcha User
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                        @matcha
                                    </Text>
                                </Box>
                                <ActionIcon
                                    variant="subtle"
                                    size="lg"
                                    ml="auto"
                                >
                                    •••
                                </ActionIcon>
                            </Flex>
                        </Box>
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

                        <Group
                            mt={{
                                base: "auto",
                            }}
                        >
                            <LoginModal />
                            <RegisterModal />
                        </Group>
                    </Flex>
                </Flex>
            </AppShell.Aside>
        </AppShell>
    );
}
