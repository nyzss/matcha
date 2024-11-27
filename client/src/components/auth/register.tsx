"use client";

import { registerSchema } from "@/lib/validation";
import { Box, Button, Flex, Modal, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconAt, IconLock, IconUser } from "@tabler/icons-react";
import { TRegister } from "@/types/validation";
import { authRegister } from "@/lib/api";

export function RegisterModal() {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <Box>
            <Button onClick={open}>Register</Button>
            <Modal opened={opened} onClose={close} title="Register" centered>
                <RegisterComponent />
            </Modal>
        </Box>
    );
}

export default function RegisterComponent() {
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            username: "",
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: "",
        },
        validate: zodResolver(registerSchema),
    });

    const handleSubmit = async (values: TRegister) => {
        const fields = await authRegister(values);
        if (fields !== null) {
            form.setErrors(fields);
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
