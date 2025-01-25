import {
    ActionIcon,
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
import { useEffect, useState } from "react";
import EditProfile from "~/components/profile/edit-profile";
import { getImage, getUser } from "~/lib/api";
import { Carousel } from "@mantine/carousel";
import { useAuth } from "~/contexts/auth-provider";

import type { Route } from "./+types/profile";
import {
    IconAlertSquareRoundedFilled,
    IconChevronLeft,
    IconMoodSadSquint,
    IconSettings,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

export default function Profile({
    params: { userId: username },
}: Route.ComponentProps) {
    const { data, isPending, isError } = useQuery({
        queryKey: ["profile", username],
        queryFn: async () => {
            return getUser(username);
        },
        retry: false,
    });
    const [isMe, setIsMe] = useState(false);
    const navigate = useNavigate();

    const { user } = useAuth();

    useEffect(() => {
        const checkIsMe = username === "@me";
        if (checkIsMe && user) {
            setIsMe(true);
        }
    }, [username]);

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

    const images = [
        "https://api.dicebear.com/9.x/glass/svg?seed=qwertyui",
        "https://api.dicebear.com/9.x/glass/svg?seed=1234567",
        "https://api.dicebear.com/9.x/glass/svg?seed=zxcvb1234",
    ];
    return (
        <Box h={"100%"} pos={"relative"}>
            <LoadingOverlay visible={isPending} />
            <Card>
                <Flex direction={"column"} py={16}>
                    <Avatar
                        color="initials"
                        name={`${data?.firstName} ${data?.lastName}`}
                        size={100}
                        mt={8}
                        src={getImage(data?.avatar)}
                    />
                    <Flex
                        direction={{
                            base: "column",
                            sm: "row",
                        }}
                    >
                        <Text size="xl" fw={"bold"} mt={4}>
                            {data?.firstName} {data?.lastName} (@
                            {data?.username})
                        </Text>
                        {isMe && (
                            <Button
                                ml={{
                                    sm: "auto",
                                }}
                                variant="light"
                                component={Link}
                                to={"/settings"}
                                leftSection={<IconSettings />}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </Flex>
                    <Text mt={8}>{data?.biography || "No biography set"}</Text>
                    <Text fw={"bold"} size="md" mt={8} mb={4}>
                        Interests
                    </Text>
                    <Flex gap={"md"} wrap={"wrap"}>
                        {data?.tags && data?.tags.length > 0 ? (
                            data?.tags?.map((tag) => (
                                <Badge key={tag} size="lg">
                                    {tag}
                                </Badge>
                            ))
                        ) : (
                            <Text>No interests</Text>
                        )}
                    </Flex>
                </Flex>
                {data?.pictures && data?.pictures.length > 0 ? (
                    <Carousel withIndicators h={"100%"} loop>
                        {data?.pictures.map((image, index) => (
                            <Carousel.Slide key={index} h={"100%"}>
                                <Image
                                    src={getImage(image)}
                                    alt="profile background"
                                    w={"100%"}
                                    h={800}
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
