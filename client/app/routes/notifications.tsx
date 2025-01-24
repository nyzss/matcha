import { Box, Card, Flex, Group, Text } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "~/lib/api";

export default function Notifications() {
    const { data, isSuccess } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
    });

    const notificationType = (type: string) => {
        switch (type) {
            case "Like":
                return "liked your profile";
            default:
                return type;
        }
    };

    return (
        <Flex direction={"column"} h={"100%"} gap={"sm"}>
            {isSuccess &&
                data.notifications.map((notification, index) => (
                    <Card key={index} withBorder>
                        <Flex direction={"row"} gap={"sm"}>
                            <IconBell size={38} />
                            <Flex direction={"column"}>
                                <Text size="lg">
                                    {`${notification.sender.firstName} ${notification.sender.lastName}`}{" "}
                                    {notificationType(notification.type)}
                                </Text>
                                <Text>@{notification.sender.username}</Text>
                            </Flex>
                        </Flex>
                    </Card>
                ))}
        </Flex>
    );
}
