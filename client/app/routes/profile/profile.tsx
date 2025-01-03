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
import { getUser } from "~/lib/api";
import { Carousel } from "@mantine/carousel";
import { useAuth } from "~/contexts/auth-provider";

import type { Route } from "./+types/profile";
import {
    IconAlertSquareRoundedFilled,
    IconChevronLeft,
} from "@tabler/icons-react";
import { useNavigate } from "react-router";

export default function Profile({
    params: { userId: username },
}: Route.ComponentProps) {
    const [currentUser, setCurrentUser] = useState<IProfile | null>(null);
    const [isMe, setIsMe] = useState<boolean>(false);
    const navigate = useNavigate();

    const { user } = useAuth();

    useEffect(() => {
        const checkIsMe = username === "@me";
        setIsMe(checkIsMe);
        if (checkIsMe) {
            setCurrentUser(user);
        } else {
            getUser(username)
                .then((data) => setCurrentUser(data))
                .catch(() => {
                    setCurrentUser(null);
                });
        }
    }, [username, user]);

    if (!currentUser) {
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
        <Box h={"100vh"}>
            <LoadingOverlay visible={!currentUser} />
            <Card h={"100%"}>
                <Flex direction={"column"} py={16}>
                    <Avatar
                        color="initials"
                        name={`${currentUser?.firstName} ${currentUser?.lastName}`}
                        size={100}
                        mt={8}
                    />
                    <Flex
                        direction={{
                            base: "column",
                            sm: "row",
                        }}
                    >
                        <Text size="xl" fw={"bold"} mt={4}>
                            {currentUser?.firstName} {currentUser?.lastName} (@
                            {currentUser?.username})
                        </Text>
                        {isMe && <EditProfile />}
                    </Flex>
                    <Text mt={8}>
                        {currentUser?.biography || "No biography set"}
                    </Text>
                    <Text fw={"bold"} size="md" mt={8} mb={4}>
                        Interests
                    </Text>
                    <Flex gap={"md"} wrap={"wrap"}>
                        {currentUser?.tags && currentUser?.tags.length > 0 ? (
                            currentUser?.tags?.map((tag) => (
                                <Badge key={tag} size="lg">
                                    {tag}
                                </Badge>
                            ))
                        ) : (
                            <Text>No interests</Text>
                        )}
                    </Flex>
                </Flex>
                <Carousel withIndicators>
                    {images.map((image, index) => (
                        <Carousel.Slide key={index}>
                            <Image
                                src={image}
                                alt="profile background"
                                w={"100%"}
                                h={"100%"}
                                fit="cover"
                                radius={"md"}
                            />
                        </Carousel.Slide>
                    ))}
                </Carousel>
            </Card>
        </Box>
    );
}
