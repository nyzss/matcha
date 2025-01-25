import {
    Container,
    Flex,
    Stepper,
    Text,
    Title,
    useMantineTheme,
} from "@mantine/core";
import InitialSetup from "~/components/onboard/initial-setup";

export default function Onboarding() {
    const { primaryColor } = useMantineTheme();
    return (
        <Container h={"100%"} mt={65} size={"md"}>
            <Flex direction={"column"} gap={"xl"}>
                <Container size={"sm"}>
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
                </Container>
                <InitialSetup />
            </Flex>
        </Container>
    );
}
