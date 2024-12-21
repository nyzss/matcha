"use client";

import { registerSchema } from "@/lib/validation";
import { Box, Button, Flex, Modal, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconAt, IconCalendar, IconLock, IconUser } from "@tabler/icons-react";
import { IRegister } from "@/types/validation";
import { authRegister } from "@/lib/api";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";

export function RegisterModal() {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <Box>
            <Button onClick={open}>Register</Button>
            <Modal opened={opened} onClose={close} title="Register" centered>
                <Box p={"xs"}>
                    <RegisterComponent close={close} />
                </Box>
            </Modal>
        </Box>
    );
}

export default function RegisterComponent({ close }: { close?: () => void }) {
    const router = useRouter();

    const form = useForm<IRegister>({
        mode: "uncontrolled",
        initialValues: {
            username: "",
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: "",
            birthDate: new Date(),
        },
        validate: zodResolver(registerSchema),
    });

    const handleSubmit = async (values: IRegister) => {
        const fields = await authRegister(values);
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
                router.push("/");
            }
        }
    };

    return (
        <Box>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Flex gap={"md"}>
                    <TextInput
                        label="First Name"
                        placeholder="First Name"
                        key={form.key("firstName")}
                        withAsterisk
                        {...form.getInputProps("firstName")}
                    />
                    <TextInput
                        label="Last Name"
                        placeholder="Last Name"
                        key={form.key("lastName")}
                        withAsterisk
                        {...form.getInputProps("lastName")}
                    />
                </Flex>
                <Flex gap={"md"} direction={"column"} mt={"sm"}>
                    <TextInput
                        label="Username"
                        placeholder="Username"
                        key={form.key("username")}
                        withAsterisk
                        leftSection={<IconUser size={18} />}
                        leftSectionPointerEvents="none"
                        {...form.getInputProps("username")}
                    />
                    <TextInput
                        label="Email"
                        placeholder="Email"
                        key={form.key("email")}
                        leftSection={<IconAt size={18} />}
                        leftSectionPointerEvents="none"
                        withAsterisk
                        {...form.getInputProps("email")}
                    />
                    <DatePickerInput
                        label="Birth Date"
                        placeholder="Birth Date"
                        key={form.key("birthDate")}
                        leftSection={<IconCalendar size={18} />}
                        leftSectionPointerEvents="none"
                        withAsterisk
                        {...form.getInputProps("birthDate")}
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
                    <TextInput
                        label="Confirm Password"
                        placeholder="Confirm Password"
                        type="password"
                        key={form.key("confirmPassword")}
                        leftSection={<IconLock size={18} />}
                        leftSectionPointerEvents="none"
                        withAsterisk
                        {...form.getInputProps("confirmPassword")}
                    />
                </Flex>
                <Button type="submit" my={"lg"}>
                    Register
                </Button>
            </form>
        </Box>
    );
}

