"use client";
import { useAuthStore } from "@/lib/store";
import { Profile } from "@/types/auth";
import { Avatar, Box, Card, Image, Text } from "@mantine/core";
import React from "react";

export default function ProfilePage() {
    const user: Profile | null = useAuthStore((state) => state.user);

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
                <Avatar
                    color="initials"
                    name={`${user?.firstName} ${user?.lastName}`}
                    size={100}
                ></Avatar>
                <Text size="xl" fw={"bold"}>
                    {user?.firstName} {user?.lastName} (@{user?.username})
                </Text>
            </Card>
        </Box>
    );
}
