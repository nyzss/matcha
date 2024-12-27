import { AppShell, Box, Button, Paper, Text, Title } from "@mantine/core";
import classes from "./auth.module.css";
import { IconArrowLeft } from "@tabler/icons-react";
import { Outlet, useNavigate } from "react-router";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const navigate = useNavigate();
    const redirection = () => {
        navigate("/");
    };

    return (
        <AppShell
            header={{
                height: 0,
            }}
            navbar={{
                width: 500,
                breakpoint: "sm",
            }}
            padding="md"
        >
            <AppShell.Navbar>
                <Paper p={"xl"}>
                    <Button variant="subtle" onClick={redirection} mt={30}>
                        <IconArrowLeft size={16} style={{ marginRight: 4 }} />{" "}
                        Go Home
                    </Button>
                    <Title order={2} ta={"center"} my={30}>
                        Welcome to Matcha!
                        <Text fw={600} mt={5}>
                            Cupid called; he outsourced his job to us.
                        </Text>
                    </Title>
                    <Box>
                        <Outlet />
                    </Box>
                </Paper>
            </AppShell.Navbar>
            <AppShell.Main className={classes.wrapper}></AppShell.Main>
        </AppShell>
    );
}
