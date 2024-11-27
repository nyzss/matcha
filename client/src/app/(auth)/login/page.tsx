import LoginComponent from "@/components/auth/login";
import { Anchor, Box, Text } from "@mantine/core";
import Link from "next/link";

export default function Login() {
    return (
        <Box>
            <LoginComponent />
            <Text ta="center" mt="md">
                Don&apos;t have an account?{" "}
                <Link href="/register">
                    <Anchor component="span">Register</Anchor>
                </Link>
            </Text>
        </Box>
    );
}
