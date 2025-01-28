import {
    Avatar,
    Box,
    Button,
    Card,
    Flex,
    LoadingOverlay,
    Text,
    Title,
    useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBlockedUsers, getImage, unblockUser } from "~/lib/api";

export default function BlockedUsers() {
    const queryClient = useQueryClient();
    const theme = useMantineTheme();

    const { data, isPending } = useQuery({
        queryKey: ["blocked-users"],
        queryFn: getBlockedUsers,
    });

    const mutateUnblock = useMutation({
        mutationFn: async (username: string) => {
            return unblockUser(username);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["blocked-users"],
            });
            notifications.show({
                title: "User unblocked",
                message: "User has been unblocked successfully",
                color: "green",
            });
        },
    });

    return (
        <Box pos={"relative"} py={"sm"}>
            <LoadingOverlay visible={isPending} />
            <Flex direction={"column"} gap="md">
                {(data &&
                    data.users.length > 0 &&
                    data?.users.map((user) => (
                        <Card key={user.id}>
                            <Flex gap={"sm"} h={"100%"} align={"center"}>
                                <Avatar
                                    color="initials"
                                    name={`${user.firstName} ${user.lastName}`}
                                    size={55}
                                    src={getImage(user.avatar)}
                                />
                                <Flex direction={"column"} gap={3}>
                                    <Title fz={"lg"}>
                                        {user.firstName} {user.lastName}
                                    </Title>
                                    <Text
                                        fw={"bold"}
                                        c={`${theme.primaryColor}.3`}
                                    >
                                        @{user.username}
                                    </Text>
                                </Flex>
                                <Button
                                    color="red"
                                    onClick={() =>
                                        mutateUnblock.mutate(user.username)
                                    }
                                    ml={"auto"}
                                >
                                    Unblock
                                </Button>
                            </Flex>
                        </Card>
                    ))) || (
                    <Flex
                        h={"100%"}
                        align={"center"}
                        justify={"center"}
                        py={"xl"}
                    >
                        <Text size={"xl"} c={"dimmed"}>
                            No blocked users
                        </Text>
                    </Flex>
                )}
            </Flex>
        </Box>
    );
}
