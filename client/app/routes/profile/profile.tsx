import { Carousel } from "@mantine/carousel";
import {
    ActionIcon,
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Flex,
    Image,
    Indicator,
    LoadingOverlay,
    Menu,
    Text,
    Title,
    Tooltip,
} from "@mantine/core";
import { useAuth } from "~/contexts/auth-provider";
import {
    blockUser,
    getImage,
    getUser,
    likeUser,
    reportUser,
    unLikeUser,
} from "~/lib/api";

import { notifications } from "@mantine/notifications";
import {
    IconAlertSquareRoundedFilled,
    IconChevronLeft,
    IconFlag,
    IconHeart,
    IconHeartBroken,
    IconMoodSadSquint,
    IconSettings,
    IconUserOff,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/profile";

export default function Profile({
    params: { userId: username },
}: Route.ComponentProps) {
    const queryClient = useQueryClient();
    const { data, isPending, isError } = useQuery({
        queryKey: ["profile", username],
        queryFn: async () => {
            return getUser(username);
        },
        retry: false,
    });

    const mutateLike = useMutation({
        mutationFn: async () => {
            return likeUser(username);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["profile", username],
            });
        },
    });

    const mutateUnlike = useMutation({
        mutationFn: async () => {
            return unLikeUser(username);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["profile", username],
            });
        },
    });

    const mutateBlock = useMutation({
        mutationFn: async () => {
            return blockUser(username);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["profile", username],
            });
        },
    });

    const mutateReport = useMutation({
        mutationFn: async () => {
            return reportUser(username);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["profile", username],
            });
            notifications.show({
                title: "User reported",
                message: "The user has been reported",
            });
        },
        onError: () => {
            notifications.show({
                title: "Already reported",
                message: "You've already reported this user",
            });
        },
    });

    const { user } = useAuth();
    const navigate = useNavigate();

    if (isError) {
        return (
            <Box h={"100vh"}>
                <Button variant="subtle" onClick={() => navigate("/")}>
                    <IconChevronLeft /> Go back
                </Button>
                <Flex h={"100%"} align={"center"} direction={"column"} pt={50}>
                    <IconAlertSquareRoundedFilled size={96} />
                    <Title mt={"sm"}>Oops!</Title>
                    <Text>We couldn't find the user you're looking for.</Text>
                </Flex>
            </Box>
        );
    }

    const isMe = username === "@me" || username === user?.username;

    return (
        <Box h={"100%"} pos={"relative"}>
            <LoadingOverlay visible={isPending} />
            <Card mih={"100%"}>
                <Flex direction={"column"} py={16}>
                    <Flex>
                        <Tooltip
                            label="You have both matched each other"
                            disabled={!data?.user.isConnected}
                        >
                            <Indicator
                                inline
                                label={<IconHeart size={20} />}
                                size={26}
                                offset={10}
                                flex={"none"}
                                disabled={!data?.user.isConnected}
                                withBorder
                            >
                                <Avatar
                                    color="initials"
                                    name={`${data?.user.firstName} ${data?.user.lastName}`}
                                    size={100}
                                    src={getImage(data?.user.avatar)}
                                />
                            </Indicator>
                        </Tooltip>
                        <Flex gap={"sm"} justify={"flex-end"} w={"100%"}>
                            <Menu>
                                <Menu.Target>
                                    <ActionIcon
                                        variant="transparent"
                                        color="dimmed"
                                    >
                                        <IconFlag />
                                    </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Item
                                        leftSection={<IconFlag />}
                                        onClick={() => mutateReport.mutate()}
                                    >
                                        Report
                                    </Menu.Item>
                                    <Menu.Item
                                        leftSection={<IconUserOff />}
                                        color="red"
                                        onClick={() => mutateBlock.mutate()}
                                    >
                                        Block
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                            <Badge
                                radius={"md"}
                                color={
                                    isMe
                                        ? "green"
                                        : data?.user.isOnline
                                        ? "green"
                                        : "red"
                                }
                                variant="light"
                            >
                                {isMe
                                    ? "Online"
                                    : data?.user.isOnline
                                    ? "Online"
                                    : "Offline"}
                            </Badge>
                        </Flex>
                    </Flex>
                    <Flex
                        direction={{
                            base: "column",
                            sm: "row",
                        }}
                    >
                        <Text size="xl" fw={"bold"} mt={4}>
                            {data?.user.firstName} {data?.user.lastName} (@
                            {data?.user.username})
                        </Text>
                        {(isMe && (
                            <Button
                                ml={{
                                    sm: "auto",
                                }}
                                variant="light"
                                component={Link}
                                to={"/settings"}
                                flex={"none"}
                                leftSection={<IconSettings />}
                            >
                                Edit Profile
                            </Button>
                        )) || (
                            <Box ml={"auto"} flex={"none"}>
                                {(!data?.liked && (
                                    <Button
                                        variant="light"
                                        c={"red"}
                                        leftSection={<IconHeart />}
                                        onClick={() => mutateLike.mutate()}
                                        loading={mutateLike.isPending}
                                    >
                                        Match
                                    </Button>
                                )) || (
                                    <Button
                                        variant="light"
                                        c={"teal"}
                                        leftSection={<IconHeartBroken />}
                                        color="teal"
                                        onClick={() => mutateUnlike.mutate()}
                                        loading={mutateUnlike.isPending}
                                    >
                                        Unmatch
                                    </Button>
                                )}
                            </Box>
                        )}
                    </Flex>
                    <Text mt={8}>
                        {data?.user.biography || "No biography set"}
                    </Text>
                    <Text fw={"bold"} size="md" mt={8} mb={4}>
                        Interests
                    </Text>
                    <Flex gap={"md"} wrap={"wrap"}>
                        {data?.user.tags && data?.user.tags.length > 0 ? (
                            data?.user.tags?.map((tag) => (
                                <Badge key={tag} size="lg" variant="light">
                                    {tag}
                                </Badge>
                            ))
                        ) : (
                            <Text>No interests</Text>
                        )}
                    </Flex>
                </Flex>
                {data?.user.pictures && data?.user.pictures.length > 0 ? (
                    <Carousel withIndicators loop>
                        {data?.user.pictures.map((image, index) => (
                            <Carousel.Slide key={index} h={"100%"}>
                                <Image
                                    src={getImage(image)}
                                    alt="profile background"
                                    w={"100%"}
                                    h={640}
                                    fit="cover"
                                    radius={"md"}
                                />
                            </Carousel.Slide>
                        ))}
                    </Carousel>
                ) : (
                    <Flex
                        align={"center"}
                        justify={"center"}
                        direction={"column"}
                        gap={"sm"}
                        h={"100%"}
                        py={"lg"}
                    >
                        <IconMoodSadSquint size={150} />
                        <Title>No pictures found</Title>
                        <Text>This person must be shy. Maybe</Text>
                    </Flex>
                )}
            </Card>
        </Box>
    );
}
