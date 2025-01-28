import { Box, LoadingOverlay, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getViews } from "~/lib/api";
import List from "./list";

export default function ViewsList() {
    const { data, isPending } = useQuery({
        queryKey: ["views"],
        queryFn: getViews,
    });

    return (
        <Box pos={"relative"} py={"sm"}>
            <LoadingOverlay visible={isPending} />
            <Text mb={"sm"} c={"dimmed"}>
                Users who haved viewed your profile will appear here.{" "}
            </Text>
            {data && <List data={data} />}
        </Box>
    );
}
