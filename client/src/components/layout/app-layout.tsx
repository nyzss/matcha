"use client";

import { AppShell, Burger, Button, Flex, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();

    const navbarAsideWidth = { base: 200, md: 200, lg: 400, xl: 550 };

    return (
        <AppShell
            header={{
                height: { base: 60, md: 60, lg: 60 },
            }}
            footer={{ height: { base: 60, md: 70, lg: 80 } }}
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
                    justify={"flex"}
                    gap={"md"}
                >
                    <Button variant="subtle" size="lg">
                        Home
                    </Button>
                    <Button variant="subtle" size="lg">
                        Matches
                    </Button>
                    <Button variant="subtle" size="lg">
                        Messages
                    </Button>
                    <Button variant="subtle" size="lg">
                        Profile
                    </Button>
                </Flex>
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
            <AppShell.Aside p="md">Aside</AppShell.Aside>
            <AppShell.Footer p="md">Footer</AppShell.Footer>
        </AppShell>
    );
}
