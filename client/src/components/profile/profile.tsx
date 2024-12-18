"use client";

import { Avatar, Box, Card, Flex, Image, Text } from "@mantine/core";
import { IProfile } from "@/types/auth";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/api";
import EditProfile from "./edit-profile";
import { Carousel } from "@mantine/carousel";

export default function Profile({ id }: { id: string }) {
    const [user, setUser] = useState<IProfile | null>(null);

    useEffect(() => {
        getUser(id).then((data) => setUser(data));
    }, [id]);

    const images = [
        "https://api.dicebear.com/9.x/glass/svg?seed=qwertyui",
        "https://api.dicebear.com/9.x/glass/svg?seed=1234567",
        "https://api.dicebear.com/9.x/glass/svg?seed=zxcvb1234",
    ];

    return (
        <Box h={"100vh"}>
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
                            name={`${user?.firstName} ${user?.lastName}`}
                            size={100}
                            mt={8}
                        ></Avatar>
                        <Text size="xl" fw={"bold"} mt={4}>
                            {user?.firstName} {user?.lastName} (@
                            {user?.username})
                        </Text>
                        <Text>{user?.biography || "No biography set"}</Text>
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
                            />
                        </Carousel.Slide>
                    ))}
                </Carousel>
            </Card>
        </Box>
    );
}

