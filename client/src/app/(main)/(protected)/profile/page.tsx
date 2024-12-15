"use client";
import { useAuthStore } from "@/lib/store";
import { Profile } from "@/types/auth";
import { Avatar, Box, Button, Card, Flex, Image, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";

export default function ProfilePage() {
    const user: Profile | null = useAuthStore((state) => state.user);

    const [opened, { open, close }] = useDisclosure();
    
    return (
        <Box h={"100vh"}>
            <Card>
                <Card.Section>
                    <Image
                        src={
                            "https://api.dicebear.com/9.x/glass/svg?seed=matcha"
                        }
                        alt="profile background"
                        w={"100%"}
                        h={"200"}
                        fit="cover"
                    />
                </Card.Section>
                <Flex justify={"center"} align={"center"}>
                <Flex direction={"column"}>
                <Avatar
                    color="initials"
                    name={`${user?.firstName} ${user?.lastName}`}
                    size={100}
                    mt={8}
                ></Avatar>
                <Text size="xl" fw={"bold"} mt={4}>
                    {user?.firstName} {user?.lastName} (@{user?.username})
                </Text>
                <Text>
                    {user?.biography}
                </Text>
                </Flex>
                <Modal opened={opened} onClose={close} title="Edit Profile" size={"xl"} centered>
                    <h1>edit your profile content here</h1>
                </Modal>
                <Button ml={"auto"} variant="light" onClick={open}>Edit Profile</Button>
                </Flex>
            </Card>
        </Box>
    );
}
