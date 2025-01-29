import { Button, Card, Flex, PasswordInput, Text, Title } from "@mantine/core";
import { hasLength, matchesField, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { checkResetPassword, resetPassword } from "~/lib/api";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const error = () => {
        navigate("/forgot-password");
        notifications.show({
            title: "Invalid token",
            message: "The token is invalid, please try again",
            color: "red",
            autoClose: false,
        });
    };

    const resetMutation = useMutation({
        mutationFn: ({
            password,
            token,
        }: {
            password: string;
            token: string;
        }) => resetPassword(password, token),
        onSuccess: () => {
            notifications.show({
                title: "Successfuly reset password",
                message:
                    "You will be redirected to the login page, please login with your new password",
                autoClose: false,
            });

            setTimeout(() => {
                navigate("/login");
            }, 500);
        },
        onError: () => {
            error();
        },
    });

    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            error();
        } else {
            checkResetPassword(token).catch(() => {
                error();
            });
        }
    }, [token]);

    const form = useForm<{ password: string; confirmPassword: string }>({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validate: {
            password: hasLength(
                { min: 6, max: 64 },
                "Password must be between 6 and 64 characters"
            ),
            confirmPassword: matchesField("password", "Passwords do not match"),
        },
    });

    const handleSubmit = form.onSubmit(({ password }) => {
        resetMutation.mutate({ password: password, token: token || "" });
    });

    return (
        <Flex direction={"column"} my={30}>
            <Title ta={"center"}>Forgot your password?</Title>
            <Text c="dimmed" fz="sm" ta="center">
                Enter your email to get a reset link
            </Text>
            <form onSubmit={handleSubmit}>
                <Card withBorder shadow="md" p={30} mt="xl">
                    <Flex gap={"sm"} direction={"column"}>
                        <PasswordInput
                            type="password"
                            label="New password"
                            placeholder="New password"
                            required
                            withAsterisk
                            {...form.getInputProps("password")}
                        />
                        <PasswordInput
                            type="password"
                            label="Confirm password"
                            placeholder="Confirm password"
                            required
                            withAsterisk
                            {...form.getInputProps("confirmPassword")}
                        />
                        <Button
                            type="submit"
                            flex={"none"}
                            style={{
                                alignSelf: "flex-end",
                            }}
                        >
                            Reset password
                        </Button>
                    </Flex>
                </Card>
            </form>
        </Flex>
    );
}
