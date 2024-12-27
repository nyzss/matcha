import RegisterComponent from "~/components/auth/register-form";
import { Anchor, Box, Text } from "@mantine/core";
import { Link } from "react-router";

export default function Register() {
    return (
        <Box>
            <RegisterComponent />
            <Text ta="center" mt="md">
                Already have an account?{" "}
                <Link to="/login">
                    <Anchor component="span">Login</Anchor>
                </Link>
            </Text>
        </Box>
    );
}
