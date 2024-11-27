"use client";
import { AppShell, Box, Button, Paper, Title } from "@mantine/core";
import React from "react";
import classes from "./auth.module.css";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const navbarAsideWidth = { base: 400 };

    const router = useRouter();

    return (
        <AppShell
            navbar={{
                width: navbarAsideWidth,
                breakpoint: "sm",
            }}
            padding="md"
        >
            <AppShell.Navbar w={"full"}>
                <Paper p={"md"}>
                    <Button variant="subtle" onClick={router.back} mt={30}>
                        <IconArrowLeft /> Go Back
                    </Button>
                    <Title order={2} ta={"center"} my={30}>
                        Welcome to Matcha!
                    </Title>
                    <Box>{children}</Box>
                </Paper>
            </AppShell.Navbar>
            <AppShell.Main className={classes.wrapper}></AppShell.Main>
        </AppShell>
    );
}
