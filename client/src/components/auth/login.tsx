"use client";

import { Box, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";

export function LoginModal() {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <Box>
            <Button onClick={open}>Login</Button>
            <Modal opened={opened} onClose={close} centered>
                <LoginComponent />
            </Modal>
        </Box>
    );
}

export default function LoginComponent() {
    return (
        <div>
            <h1>hello</h1>
        </div>
    );
}
