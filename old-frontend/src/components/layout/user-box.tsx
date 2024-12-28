"use client";

import { useAuth } from "@/contexts/auth-provider";
import { ActionIcon, Box, Flex, Menu, Text } from "@mantine/core";
import { IconLogout, IconSettings } from "@tabler/icons-react";
import React from "react";

export default function UserBox() {
    const { user, logout } = useAuth();

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
                            onClick={logout}
                        >
                            Logout
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Flex>
        </Box>
    );
}

