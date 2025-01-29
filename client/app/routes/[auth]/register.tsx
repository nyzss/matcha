import RegisterComponent from "~/components/auth/register-form";
import { Anchor, Box, Text, Title } from "@mantine/core";
import { Link } from "react-router";

export default function Register() {
    return (
        <Box>
            <Title order={2} ta={"center"} my={30}>
                Welcome to Matcha!
                <Text fw={600} mt={5}>
                    Cupid called; he outsourced his job to us.
                </Text>
            </Title>
            <RegisterComponent />
            <Text ta="center" mt="md">
                Already have an account?{" "}
                <Anchor component={Link} to={"/login"}>
                    Login
                </Anchor>
            </Text>
        </Box>
    );
}
