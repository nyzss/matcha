"use client";

import {
    Avatar,
    Box,
    Card,
    Flex,
    Image,
    LoadingOverlay,
    Text,
} from "@mantine/core";
import { IProfile } from "@/types/auth";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/api";
import EditProfile from "./edit-profile";
import { Carousel } from "@mantine/carousel";
import { useAuth } from "@/contexts/auth-provider";

export default function Profile({ id }: { id: string }) {
    const [currentUser, setCurrentUser] = useState<IProfile | null>(null);

    const { user } = useAuth();

    useEffect(() => {
        if (id === "@me") {
            setCurrentUser(user);
        } else {
            getUser(id).then((data) => setCurrentUser(data));
        }
    }, [id, user]);

    const images = [
        "https://api.dicebear.com/9.x/glass/svg?seed=qwertyui",
        "https://api.dicebear.com/9.x/glass/svg?seed=1234567",
        "https://api.dicebear.com/9.x/glass/svg?seed=zxcvb1234",
    ];

    return (
        <Box h={"100vh"}>
            <LoadingOverlay visible={!currentUser} />
            <Card h={"100%"}>
                {/* <Card.Section>
                    <Image
                        src={
                            "https://api.dicebear.com/9.x/glass/svg?seed=matcha"
                        }
                        alt="profile background"
                        w={"100%"}
                        h={"160"}
                        fit="cover"
                    />
                </Card.Section> */}
                <Flex justify={"center"} align={"center"} py={16}>
                    <Flex direction={"column"}>
                        <Avatar
                            color="initials"
                            name={`${currentUser?.firstName} ${currentUser?.lastName}`}
                            size={100}
                            mt={8}
                        />
                        <Text size="xl" fw={"bold"} mt={4}>
                            {currentUser?.firstName} {currentUser?.lastName} (@
                            {currentUser?.username})
                        </Text>
                        <Text>
                            {currentUser?.biography || "No biography set"}
                        </Text>
                    </Flex>
                    <EditProfile />
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
