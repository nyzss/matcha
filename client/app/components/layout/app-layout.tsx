import {
    AppShell,
    Burger,
    Button,
    Flex,
    Group,
    Indicator,
    TextInput,
    useMantineColorScheme,
} from "@mantine/core";
import type { AppShellResponsiveSize } from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { IconMoon, IconSearch, IconSun } from "@tabler/icons-react";
import { routes } from "./routes";
import { Link, Outlet } from "react-router";
import UserBox from "./user-box";
import { useMemo } from "react";
import { useAuth } from "~/contexts/auth-provider";
import Onboarding from "../onboard/onboarding";

export default function AppLayout() {
    const [opened, { toggle }] = useDisclosure();
    const { logged } = useAuth();
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
                                    leftSection={
                                        route.indicator ? (
                                            <Indicator
                                                inline
                                                label="16"
                                                size={16}
                                            >
                                                {route.icon}
                                            </Indicator>
                                        ) : (
                                            route.icon
                                        )
                                    }
                                    component={Link}
                                    to={route.link}
                                    key={route.name}
                                    justify="flex-start"
                                >
                                    {route.name}
                                </Button>
                            ))}
                        </Flex>
                        {logged && <UserBox />}
                        {!logged && (
                            <Flex
                                display={{
                                    sm: "none",
                                }}
                                mt={"auto"}
                                gap={"md"}
                                w={"100%"}
                            >
                                <Button
                                    component={Link}
                                    to={"login"}
                                    variant="light"
                                    w={"100%"}
                                >
                                    Login
                                </Button>
                                <Button
                                    component={Link}
                                    w={"100%"}
                                    to={"register"}
                                >
                                    Register
                                </Button>
                            </Flex>
                        )}
                    </Flex>
                </Flex>
            </AppShell.Navbar>
            <AppShell.Main h={"100vh"}>
                <Outlet />
                <Onboarding />
            </AppShell.Main>
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
                                <Button
                                    component={Link}
                                    to={"/login"}
                                    variant="light"
                                >
                                    Login
                                </Button>
                                <Button component={Link} to={"/register"}>
                                    Register
                                </Button>
                            </Group>
                        )}
                    </Flex>
                </Flex>
            </AppShell.Aside>
        </AppShell>
    );
}
