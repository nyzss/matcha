import { Box, Card, Flex, Group, Text, Title } from "@mantine/core";
import { IconBell, IconMoodSmileBeam } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
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
            case "View":
                return "has viewed your profile";
            case "RequestMatch":
                return "wants to match with you";
            default:
                return type;
        }
    };

    return (
        <Flex direction={"column"} gap={"sm"}>
            {(isSuccess &&
                data.notifications.length > 0 &&
                data.notifications.map((notification, index) => (
                    <Card
                        key={index}
                        withBorder
                        opacity={notification.read ? 0.5 : 1}
                        component={Link}
                        to={"/profile/" + notification.sender.username}
                    >
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
                ))) || (
                <Flex
                    direction={"column"}
                    h={"100%"}
                    align={"center"}
                    justify={"center"}
                >
                    <IconMoodSmileBeam size={150} />
                    <Title>No notifications</Title>
                    <Text c={"dimmed"} mt={4}>
                        Don't worry about it, you're not missing out on anything
                    </Text>
                </Flex>
            )}
        </Flex>
    );
}
