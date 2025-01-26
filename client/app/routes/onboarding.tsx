import {
    Button,
    Center,
    Container,
    Flex,
    PinInput,
    Text,
    Title,
    useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconMail } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import EditProfile from "~/components/profile/edit-profile";
import { useAuth } from "~/contexts/auth-provider";
import { verifyEmail } from "~/lib/api";

export default function Onboarding() {
    const [pinValue, setPinValue] = useState<string>();
    const [pinError, setPinError] = useState<boolean>();

    const { user, checkUser } = useAuth();
    const navigate = useNavigate();
    const { primaryColor } = useMantineTheme();

    const mutateEmail = useMutation({
        mutationFn: async (code: string) => {
            return await verifyEmail(code);
        },
        onSuccess: async () => {
            notifications.show({
                title: "Email verified",
                message: "Your email has been successfully verified.",
                color: "green",
            });
            return await checkUser();
        },
    });

    const callback = () => {
        navigate("/");
    };

    const handleEmailVerification = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        try {
            if (!pinValue) {
                setPinError(true);
                return;
            }
            mutateEmail.mutate(pinValue);
        } catch {
            console.error("Failed to verify email.");
            setPinError(true);
        }
    };

    return (
        <Container h={"100%"} mt={65} size={"md"}>
            <Flex direction={"column"} gap={"sm"}>
                <Container
                    size={"sm"}
                    pb={{
                        sm: 80,
                    }}
                >
                    <Title mb={"sm"}>
                        Welcome to{" "}
                        <Text inherit span c={primaryColor}>
                            Matcha
                        </Text>
                    </Title>
                    <Text>
                        Let's get you set up with your profile so you can start
                        matching with other users!
                    </Text>
                    {(!user?.verified && (
                        <Center py={80}>
                            <form onSubmit={handleEmailVerification}>
                                <Flex
                                    justify={"center"}
                                    align={"center"}
                                    direction={"column"}
                                    gap={"lg"}
                                >
                                    <IconMail size={80} />
                                    <Title>Confirm your email address.</Title>
                                    <Text ta={"center"}>
                                        We've sent a 5-digit PIN to your email
                                        address. Please enter it below to verify
                                        your email address.
                                    </Text>
                                    <PinInput
                                        oneTimeCode
                                        size="lg"
                                        length={5}
                                        type={"number"}
                                        error={pinError}
                                        value={pinValue}
                                        onChange={setPinValue}
                                    />
                                    <Button
                                        variant="light"
                                        type="submit"
                                        disabled={pinValue?.length !== 5}
                                    >
                                        Validate
                                    </Button>
                                </Flex>
                            </form>
                        </Center>
                    )) || <EditProfile callback={callback} onboarding />}
                </Container>
            </Flex>
        </Container>
    );
}
