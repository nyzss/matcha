import { Container, Flex, Text, Title, useMantineTheme } from "@mantine/core";
import { useNavigate } from "react-router";
import EditProfile from "~/components/profile/edit-profile";
import { useAuth } from "~/contexts/auth-provider";

export default function Onboarding() {
    const { primaryColor } = useMantineTheme();
    const navigate = useNavigate();

    const callback = () => {
        navigate("/");
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
                    <EditProfile callback={callback} onboarding />
                </Container>
            </Flex>
        </Container>
    );
}
