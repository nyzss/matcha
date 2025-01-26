import {
    ActionIcon,
    Box,
    Flex,
    Menu,
    Text,
    useMantineColorScheme,
} from "@mantine/core";
import { IconColorSwatch, IconLogout, IconSettings } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "~/contexts/auth-provider";

export default function UserBox() {
    const { user, logout } = useAuth();
    const { toggleColorScheme } = useMantineColorScheme();

    const navigate = useNavigate();

    return (
        <Box>
            <Flex align="center">
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
                        <Menu.Item
                            leftSection={<IconColorSwatch size={18} />}
                            onClick={toggleColorScheme}
                        >
                            Toggle theme
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<IconSettings size={18} />}
                            component={Link}
                            to={"/settings"}
                        >
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
