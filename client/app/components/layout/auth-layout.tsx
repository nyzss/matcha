import { AppShell, Button, Paper } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Outlet, useNavigate } from "react-router";
import classes from "./auth.module.css";

export default function AuthLayout() {
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
                    <Outlet />
                </Paper>
            </AppShell.Navbar>
            <AppShell.Main className={classes.wrapper}></AppShell.Main>
        </AppShell>
    );
}
