import { loginSchema } from "~/lib/validation";
import {
    Box,
    Button,
    Flex,
    Modal,
    PasswordInput,
    TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconLock, IconUser } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useAuth } from "~/contexts/auth-provider";
import { useNavigate } from "react-router";
import type { ILogin } from "~/types/validation";

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
    const { login } = useAuth();
    const navigate = useNavigate();

    const form = useForm<ILogin>({
        initialValues: {
            username: "",
            password: "",
        },

        validate: zodResolver(loginSchema),
    });

    const handleSubmit = async (values: ILogin) => {
        const fields = await login(values);
        if (fields) {
            form.setErrors(fields);
        } else {
            // checks if the components is inside a modal
            if (close) {
                close();
            } else {
                notifications.show({
                    title: "Logged in.",
                    message: "You have successfully logged in!",
                });
                navigate("/", {
                    replace: true,
                });
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
                    <PasswordInput
                        label="Password"
                        placeholder="Password"
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
