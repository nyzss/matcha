"use client";

import { loginSchema } from "@/lib/validation";
import { Box, Button, Flex, Modal, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import { TLogin } from "../types";
import { IconLock, IconUser } from "@tabler/icons-react";

export function LoginModal() {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <Box>
            <Button onClick={open}>Login</Button>
            <Modal opened={opened} onClose={close} title="Login" centered>
                <LoginComponent />
            </Modal>
        </Box>
    );
}

export default function LoginComponent() {
    const form = useForm({
        initialValues: {
            username: "",
            password: "",
        },

        validate: zodResolver(loginSchema),
    });

    const handleSubmit = (values: TLogin) => {
        console.log(values);
    };

    return (
        <Box>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Flex gap={"md"} direction={"column"}>
                    <TextInput
                        label="Username"
                        placeholder="Username"
                        key={form.key("username")}
                        leftSection={<IconUser size={18} />}
                        leftSectionPointerEvents="none"
                        withAsterisk
                        {...form.getInputProps("username")}
                    />
                    <TextInput
                        label="Password"
                        placeholder="Password"
                        type="password"
                        key={form.key("password")}
                        leftSection={<IconLock size={18} />}
                        leftSectionPointerEvents="none"
                        withAsterisk
                        {...form.getInputProps("password")}
                    />
                </Flex>
                <Button type="submit" my={"lg"}>
                    Login
                </Button>
            </form>
        </Box>
    );
}
