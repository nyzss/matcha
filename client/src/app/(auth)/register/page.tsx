import RegisterComponent from "@/components/auth/register";
import { Anchor, Box, Text } from "@mantine/core";
import Link from "next/link";

export default function Register() {
    return (
        <Box>
            <RegisterComponent />
            <Text ta="center" mt="md">
                Already have an account?{" "}
                <Link href="/login">
                    <Anchor component="span">Login</Anchor>
                </Link>
            </Text>
        </Box>
    );
}
