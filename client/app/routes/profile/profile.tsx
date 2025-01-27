import { Carousel } from "@mantine/carousel";
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Flex,
    Image,
    LoadingOverlay,
    Text,
    Title,
} from "@mantine/core";
import { useAuth } from "~/contexts/auth-provider";
import { getImage, getUser, likeUser, unLikeUser } from "~/lib/api";

import {
    IconAlertSquareRoundedFilled,
    IconChevronLeft,
    IconHeart,
    IconHeartBroken,
    IconMoodSadSquint,
    IconSettings,
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
                    <Avatar
                        color="initials"
                        name={`${data?.user.firstName} ${data?.user.lastName}`}
                        size={100}
                        mt={8}
                        src={getImage(data?.user.avatar)}
                    />
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
                            <Box>
                                {(!data?.liked && (
                                    <Button
                                        ml={{ sm: "auto" }}
                                        variant="light"
                                        c={"red"}
                                        flex={"none"}
                                        leftSection={<IconHeart />}
                                        onClick={() => mutateLike.mutate()}
                                    >
                                        Match
                                    </Button>
                                )) || (
                                    <Button
                                        ml={{ sm: "auto" }}
                                        variant="light"
                                        c={"teal"}
                                        flex={"none"}
                                        leftSection={<IconHeartBroken />}
                                        color="teal"
                                        onClick={() => mutateUnlike.mutate()}
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
                                <Badge key={tag} size="lg">
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
