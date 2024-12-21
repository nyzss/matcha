"use client";

import { loginSchema } from "@/lib/validation";
import { Box, Button, Flex, Modal, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import { ILogin } from "@/types/validation";
import { IconLock, IconUser } from "@tabler/icons-react";
import { authLogin } from "@/lib/api";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

export function LoginModal() {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <Box>
            <Button onClick={open} variant="outline">
                Login
            </Button>
            <Modal opened={opened} onClose={close} title="Login" centered>
                <Box p={"xs"}>
                    <LoginComponent close={close} />
                </Box>
            </Modal>
        </Box>
    );
}

export default function LoginComponent({ close }: { close?: () => void }) {
    const router = useRouter();

    const form = useForm<ILogin>({
        initialValues: {
            username: "",
            password: "",
        },

        validate: zodResolver(loginSchema),
    });

    const handleSubmit = async (values: ILogin) => {
        const fields = await authLogin(values);
        if (fields) {
            if (fields.error) {
                notifications.show({
                    title: "Couldn't create account",
                    message: "An error has occurred, please try again later.",
                });
            } else {
                form.setErrors(fields);
            }
        } else {
            if (close) {
                close();
            } else {
                notifications.show({
                    title: "Logged in.",
                    message: "You have successfully logged in!",
                });
                router.push("/");
            }
        }
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

