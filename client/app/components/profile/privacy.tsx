import { Button, Flex, PasswordInput, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAuth } from "~/contexts/auth-provider";
import { updateEmail } from "~/lib/api";

export default function Privacy() {
    const navigate = useNavigate();
    const { metadata, checkUser } = useAuth();

    const mutateEmail = useMutation({
        mutationFn: async ({
            email,
            password,
        }: {
            email: string;
            password: string;
        }) => await updateEmail(email, password),

        onSuccess: async () => {
            notifications.show({
                title: "Email updated",
                message: "Your email has been updated successfully",
            });
            await checkUser();
        },
        onError: () => {
            notifications.show({
                title: "Failed to update email",
                message: "Please check your email and password",
                color: "red",
            });
            form.setErrors({
                email: "Invalid email or password",
                password: "Invalid email or password",
            });
        },
    });

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },
    });

    const submit = form.onSubmit((values) => {
        mutateEmail.mutate(values);
    });

    return (
        <Flex direction={"column"} gap={"sm"} my="sm">
            <Text mb={"sm"} c={"dimmed"}>
                Current email :{" "}
                {(metadata && metadata.privacy.email) || "Not set"}
            </Text>
            <form onSubmit={submit}>
                <Flex direction={"column"} gap={"sm"}>
                    <TextInput
                        label={"Email"}
                        placeholder={"Email"}
                        required
                        withAsterisk
                        {...form.getInputProps("email")}
                    />
                    <PasswordInput
                        label={"Password"}
                        placeholder={"Password"}
                        required
                        withAsterisk
                        {...form.getInputProps("password")}
                    />
                    <Button
                        type={"submit"}
                        style={{
                            alignSelf: "flex-end",
                        }}
                    >
                        Update Email
                    </Button>
                </Flex>
            </form>
            <Button
                onClick={() => navigate("/forgot-password")}
                fullWidth
                size="lg"
                variant="light"
            >
                Reset Password
            </Button>
        </Flex>
    );
}
