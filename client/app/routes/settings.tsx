import { Box } from "@mantine/core";
import EditProfile from "~/components/profile/edit-profile";

export default function Settings() {
    return (
        <Box pb={60} pt={"lg"}>
            <EditProfile />
        </Box>
    );
}
