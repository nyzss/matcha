import { useAuth } from "~/contexts/auth-provider";
import { ActionIcon, Box, Flex, Menu, Text } from "@mantine/core";
import { IconLogout, IconSettings } from "@tabler/icons-react";
import { useNavigate } from "react-router";

export default function UserBox() {
    const { user, logout } = useAuth();

    const navigate = useNavigate();

    return (
        <Box style={{ marginTop: "auto" }}>
            <Flex align="center" mt="xl">
                <Box mr="xs">
                    <Text size="sm" fw={700}>
                        {user?.firstName} {user?.lastName}
                    </Text>
                    <Text size="xs" c="dimmed">
                        @{user?.username}
                    </Text>
                </Box>
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <ActionIcon variant="subtle" size="lg" ml="auto">
                            •••
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Profile</Menu.Label>
                        <Menu.Item leftSection={<IconSettings size={18} />}>
                            Settings
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<IconLogout />}
                            onClick={() => {
                                logout();
                                navigate("/");
                            }}
                        >
                            Logout
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Flex>
        </Box>
    );
}
