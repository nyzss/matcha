"use client";

import {
    AppShell,
    Burger,
    Button,
    Flex,
    Group,
    Modal,
    rem,
    TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { routes } from "./navigations";
import Link from "next/link";
import LoginComponent from "../auth/login";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();
    const [modalOpened, { open, close }] = useDisclosure(false);

    const navbarAsideWidth = { base: 200, md: 200, lg: 400, xl: 650 };

    return (
        <AppShell
            header={{
                height: { base: 60, md: 60, lg: 60 },
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
                    {/* <h1>Matcha</h1> */}
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
                {/* <Stack align="flex-end" justify="flex-start"> */}
                {/* </Stack> */}
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
                    <Button onClick={open}>Login</Button>
                    <Modal opened={modalOpened} onClose={close} centered>
                        <LoginComponent />
                    </Modal>
                </Flex>
            </AppShell.Aside>
        </AppShell>
    );
}
