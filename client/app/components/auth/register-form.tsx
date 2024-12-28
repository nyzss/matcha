import { registerSchema } from "~/lib/validation";
import { Box, Button, Flex, Modal, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconAt, IconCalendar, IconLock, IconUser } from "@tabler/icons-react";
import { useAuth } from "~/contexts/auth-provider";
import { useNavigate } from "react-router";
import type { IRegister } from "~/types/validation";

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
    const { register } = useAuth();
    const navigate = useNavigate();

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
        const fields = await register(values);
        if (fields) {
            form.setErrors(fields);
        } else {
            if (close) {
                close();
            } else {
                navigate("/");
            }
        }
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Flex gap={"md"} direction={"column"} mt={"sm"}>
                <Flex gap={"md"}>
                    <TextInput
                        label="First Name"
                        placeholder="First Name"
                        key={form.key("firstName")}
                        withAsterisk
                        w={"100%"}
                        {...form.getInputProps("firstName")}
                    />
                    <TextInput
                        label="Last Name"
                        placeholder="Last Name"
                        key={form.key("lastName")}
                        withAsterisk
                        w={"100%"}
                        {...form.getInputProps("lastName")}
                    />
                </Flex>

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
    );
}
