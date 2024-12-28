import LoginComponent from "~/components/auth/login-form";
import { Anchor, Box, Text } from "@mantine/core";
import { Link } from "react-router";

export default function Login() {
    return (
        <Box>
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
