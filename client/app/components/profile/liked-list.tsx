import { Box, LoadingOverlay, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getLiked } from "~/lib/api";
import List from "./list";

export default function LikedList() {
    const { data, isPending } = useQuery({
        queryKey: ["views"],
        queryFn: getLiked,
    });

    return (
        <Box pos={"relative"} py={"sm"}>
            <LoadingOverlay visible={isPending} />
            <Text mb={"sm"} c={"dimmed"}>
                Users who have liked your profile will appear here.{" "}
            </Text>
            {data && <List data={data} />}
        </Box>
    );
}
