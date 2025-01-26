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
import { IconMail } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import EditProfile from "~/components/profile/edit-profile";
import { useAuth } from "~/contexts/auth-provider";

export default function Onboarding() {
    const [pinValue, setPinValue] = useState<string>();
    const [pinError, setPinError] = useState<boolean>();

    const navigate = useNavigate();
    const { primaryColor } = useMantineTheme();
    const { user } = useAuth();

    const callback = () => {
        navigate("/");
    };

    const handleEmailVerification = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        try {
            console.log("Verifying email with PIN: ", pinValue);
            setTimeout(() => {
                console.log("Email verified.");
            }, 1000);
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
