import { Box, Tabs, Text } from "@mantine/core";
import BlockedUsers from "~/components/profile/blocked-users";
import EditProfile from "~/components/profile/edit-profile";
import LikedList from "~/components/profile/liked-list";
import Privacy from "~/components/profile/privacy";
import ViewsList from "~/components/profile/views-list";

export default function Settings() {
    return (
        <Box pb={60} pt={"lg"}>
            <Tabs defaultValue="edit-profile">
                <Tabs.List>
                    <Tabs.Tab value="edit-profile">Edit Information</Tabs.Tab>
                    <Tabs.Tab value="views">Views</Tabs.Tab>
                    <Tabs.Tab value="blocked">Blocked Users</Tabs.Tab>
                    <Tabs.Tab value="privacy">Privacy & Security</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="edit-profile">
                    <EditProfile />
                </Tabs.Panel>
                <Tabs.Panel value="views">
                    <ViewsList />
                </Tabs.Panel>
                <Tabs.Panel value="blocked">
                    <BlockedUsers />
                </Tabs.Panel>
                <Tabs.Panel value="privacy">
                    <Privacy />
                </Tabs.Panel>
            </Tabs>
        </Box>
    );
}
