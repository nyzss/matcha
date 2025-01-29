import LoginComponent from "~/components/auth/login-form";
import { Anchor, Box, Text, Title } from "@mantine/core";
import { Link } from "react-router";

export default function Login() {
    return (
        <Box>
            <Title order={2} ta={"center"} my={30}>
                Welcome to Matcha!
                <Text fw={600} mt={5}>
                    Cupid called; he outsourced his job to us.
                </Text>
            </Title>
            <LoginComponent />
            <Text ta="center" mt="md">
                Don&apos;t have an account?{" "}
                <Anchor component={Link} to={"/register"}>
                    Register
                </Anchor>
            </Text>
        </Box>
    );
}
