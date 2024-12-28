import {
    Avatar,
    Badge,
    Box,
    Card,
    Flex,
    Image,
    LoadingOverlay,
    Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import EditProfile from "~/components/profile/edit-profile";
import { getUser } from "~/lib/api";
import { Carousel } from "@mantine/carousel";
import { useAuth } from "~/contexts/auth-provider";

import type { Route } from "./+types/profile";

export default function Profile({ params: { userId } }: Route.ComponentProps) {
    const [currentUser, setCurrentUser] = useState<IProfile | null>(null);
    const [isMe, setIsMe] = useState<boolean>(false);

    const { user } = useAuth();
    useEffect(() => {
        const checkIsMe = userId === "@me";
        setIsMe(checkIsMe);
        if (checkIsMe) {
            setCurrentUser(user);
        } else {
            getUser(userId).then((data) => setCurrentUser(data));
        }
    }, [isMe, userId, user]);

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
                        {user?.tags?.map((tag) => (
                            <Badge key={tag} size="lg">
                                {tag}
                            </Badge>
                        ))}
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
