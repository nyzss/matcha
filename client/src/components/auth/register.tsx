"use client";

import { registerSchema } from "@/lib/validation";
import { Box, Button, Modal, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { z } from "zod";

export function RegisterModal() {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <Box>
            <Button onClick={open}>Register</Button>
            <Modal opened={opened} onClose={close} centered>
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

    const handleSubmit = (values: z.infer<typeof registerSchema>) => {
        console.log(values);
    };

    return (
        <Box>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    label="Username"
                    placeholder="Username"
                    key={form.key("username")}
                    {...form.getInputProps("username")}
                />
                <TextInput
                    label="Email"
                    placeholder="Email"
                    key={form.key("email")}
                    mt={"sm"}
                    {...form.getInputProps("email")}
                />

                <TextInput
                    label="First Name"
                    placeholder="First Name"
                    key={form.key("firstName")}
                    mt={"sm"}
                    {...form.getInputProps("firstName")}
                />
                <TextInput
                    label="Last Name"
                    placeholder="Last Name"
                    key={form.key("lastName")}
                    mt={"sm"}
                    {...form.getInputProps("lastName")}
                />
                <TextInput
                    label="Password"
                    placeholder="Password"
                    type="password"
                    key={form.key("password")}
                    mt={"sm"}
                    {...form.getInputProps("password")}
                />
                <TextInput
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    type="password"
                    key={form.key("confirmPassword")}
                    mt={"sm"}
                    {...form.getInputProps("confirmPassword")}
                />
                <Button type="submit" mt={"md"}>
                    Submit
                </Button>
            </form>
        </Box>
    );
}
