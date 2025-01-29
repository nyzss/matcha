import {
    Anchor,
    Button,
    Card,
    Center,
    Flex,
    Group,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link } from "react-router";

export default function ForgotPassword() {
    const form = useForm<{ email: string }>({
        initialValues: {
            email: "",
        },
        validate: {
            email: isEmail("Please enter a valid email address."),
        },
    });

    const handleSubmit = form.onSubmit((values) => {
        console.log(values);
    });

    return (
        // <Container h={"100vh"} my={30}>
        //     <Center h={"100%"}>
        <Flex direction={"column"} my={30}>
            <Title ta={"center"}>Forgot your password?</Title>
            <Text c="dimmed" fz="sm" ta="center">
                Enter your email to get a reset link
            </Text>
            <form onSubmit={handleSubmit}>
                <Card withBorder shadow="md" p={30} mt="xl">
                    <TextInput
                        type="email"
                        label="Email"
                        required
                        withAsterisk
                        {...form.getInputProps("email")}
                    />
                    <Group justify="space-between" mt="lg">
                        <Anchor
                            c="dimmed"
                            size="sm"
                            component={Link}
                            to={"/login"}
                        >
                            <Center inline>
                                <IconArrowLeft size={12} stroke={1.5} />
                                <Text ml={5}>Back to the login page</Text>
                            </Center>
                        </Anchor>
                        <Button type="submit">Reset password</Button>
                    </Group>
                </Card>
            </form>
        </Flex>
        //     {/* </Center>
        // </Container> */}
    );
}
