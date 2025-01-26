import {
    Button,
    Container,
    Flex,
    Loader,
    Text,
    ThemeIcon,
    Title,
} from "@mantine/core";
import {
    IconAlertCircle,
    IconError404,
    IconRosetteDiscountCheck,
    IconZoomQuestion,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { verifyEmail } from "~/lib/api";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Container
            h={"100vh"}
            pt={{
                base: "xl",
                md: 100,
            }}
        >
            <Flex direction={"column"} align={"center"} gap={"lg"}>
                {children}

                <Button component={Link} to={"/"} variant="filled">
                    Home
                </Button>
            </Flex>
        </Container>
    );
};

export default function EmailValidated() {
    const [loading, setLoading] = useState<boolean>(true);
    const [success, setSuccess] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");

    useEffect(() => {
        if (!code) {
            return;
        }

        verifyEmail(code)
            .then((val) => {
                console.log("EMAIL VALIDATED", val);
                setSuccess(val);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [code]);

    if (!code) {
        return (
            <Layout>
                <ThemeIcon
                    size={96}
                    variant="light"
                    radius={"xl"}
                    color="yellow"
                >
                    <IconZoomQuestion size={64} />
                </ThemeIcon>
                <Title>Email validation code missing</Title>
                <Text size="lg">
                    The email validation code is missing, please check your
                    email
                </Text>
            </Layout>
        );
    }

    if (loading) {
        return (
            <Layout>
                <Loader size={"lg"} />
                <Title>Validating your email...</Title>
            </Layout>
        );
    }

    if (!success) {
        return (
            <Layout>
                <ThemeIcon size={96} variant="light" radius={"xl"} color="red">
                    <IconAlertCircle size={64} />
                </ThemeIcon>
                <Title>Email validation failed</Title>
                <Text size="lg">
                    The email validation code is invalid, please check your
                    email
                </Text>
            </Layout>
        );
    }

    return (
        <Layout>
            <ThemeIcon size={96} variant="light" radius={"xl"} color="green">
                <IconRosetteDiscountCheck size={80} />
            </ThemeIcon>
            <Title>Your email has been validated</Title>
            <Text>
                You can now login to your account or continue with the
                onboarding
            </Text>
        </Layout>
    );
}
