"use client";

import { useAuth } from "@/contexts/auth-provider";
import { fetchAllConversations } from "@/lib/api";
import { IConversation } from "@/types/types";
import {
    Avatar,
    Box,
    Button,
    Flex,
    Group,
    Text,
    TextInput,
} from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MessagesPage() {
    const [conversations, setConversations] = useState<IConversation[]>([]);

    const { user } = useAuth();

    useEffect(() => {
        const getConversations = async () => {
            setConversations(await fetchAllConversations(user!.id));
        };
        getConversations();
    }, [user]);

    return (
        <Flex direction={"column"} gap={"xs"}>
            <Group w={"100%"}>
                <TextInput
                    leftSection={<IconSearch size={16} />}
                    leftSectionPointerEvents="none"
                    placeholder="Search conversation..."
                    width={"100%"}
                    flex={1}
                />
                <Button leftSection={<IconPlus size={16} />}>New chat</Button>
            </Group>
            {conversations &&
                conversations.map((conv) => (
                    <Box key={conv.id}>
                        <Link
                            href={"/messages/" + conv.id}
                            style={{ textDecoration: "none" }}
                        >
                            <Button
                                fullWidth
                                h={"100%"}
                                variant="subtle"
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "flex-start",
                                    padding: "10px",
                                    textAlign: "left",
                                }}
                            >
                                <Group>
                                    <Avatar
                                        color="initials"
                                        // TODO: check length of conv.users, if more than 1 change Avatar to group
                                        name={`${conv.users[0].firstName} ${conv.users[0].lastName}`}
                                        size={60}
                                    />
                                    <Flex direction={"column"}>
                                        <Text size="lg" fw={"bold"}>
                                            {conv.users[0].firstName}{" "}
                                            {conv.users[0].lastName}
                                        </Text>
                                        <Text size="md" c={"gray"}>
                                            {`@${conv.users
                                                .map((user) => user.username)
                                                .join(", ")}`}
                                        </Text>
                                        <Text
                                            size="sm"
                                            fw={"lighter"}
                                            truncate="end"
                                            w={{
                                                base: 150,
                                                sm: 200,
                                                md: 300,
                                            }}
                                        >
                                            {conv.lastMessage?.sender.id ===
                                            user?.id
                                                ? "You: "
                                                : ""}
                                            {conv.lastMessage?.content ||
                                                "Start the conversation!"}
                                        </Text>
                                    </Flex>
                                </Group>
                            </Button>
                        </Link>
                    </Box>
                ))}
        </Flex>
    );
}
