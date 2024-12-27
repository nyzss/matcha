"use client";

import {
    fetchConversation,
    fetchMessageHistory,
    mutateMessage,
} from "@/lib/api";
import { IConversation, TMessageHistory } from "@/types/types";
import {
    ActionIcon,
    Avatar,
    Box,
    Divider,
    Flex,
    Paper,
    ScrollArea,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconChevronLeft, IconSend2 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ChatBox({ chatId }: { chatId: string }) {
    const [conversation, setConversation] = useState<IConversation>();
    const [messageHistory, setMessageHistory] = useState<TMessageHistory>();
    const [message, setMessage] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        fetchConversation(chatId)
            .then((data) => {
                console.log(data);
                setConversation(data);
            })
            .catch(() => {
                router.push("/messages");
            });
    }, [chatId, router]);

    useEffect(() => {
        fetchMessageHistory(chatId)
            .then((data) => {
                setMessageHistory(data);
            })
            .catch(() => {
                notifications.show({
                    title: "An error occurred",
                    message: "Couldn't fetch message history",
                    color: "red",
                });
            });
    }, [chatId]);

    const handleMessageSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message) return;

        mutateMessage(chatId, message)
            .then((data) => {
                console.log(data);
                setMessage("");
            })
            .catch(() => {
                notifications.show({
                    title: "An error occurred",
                    message: "Couldn't send message",
                    color: "red",
                });
            });
    };

    return (
        <Flex direction={"column"} gap={"xs"} h={"100%"}>
            <Flex direction={"row"} align={"center"} gap={"sm"}>
                <ActionIcon variant="transparent" onClick={() => router.back()}>
                    <IconChevronLeft />
                </ActionIcon>
                <Avatar
                    color="initials"
                    name={`${conversation?.users[0].firstName} ${conversation?.users[0].lastName}`}
                    size={45}
                />
                <Title fz={"lg"}>
                    {`${conversation?.users[0].firstName} ${conversation?.users[0].lastName} (@${conversation?.users[0].username})`}{" "}
                </Title>
            </Flex>
            <Divider size={"sm"} />
            <ScrollArea h={"100%"} scrollbars="y">
                <Flex direction={"column"} gap={"md"}>
                    {messageHistory &&
                        messageHistory.messages.map((msg) => (
                            <Paper
                                key={msg.id}
                                style={{
                                    alignSelf: "flex-end",
                                }}
                                radius={"md"}
                                shadow="sm"
                                withBorder
                                maw={"70%"}
                                bg={"var(--mantine-color-blue-light)"}
                                py={6}
                                px={"md"}
                            >
                                <Text
                                    style={{
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {msg.content}
                                </Text>
                            </Paper>
                        ))}
                </Flex>
            </ScrollArea>
            <Box mt={"auto"} mb={"md"}>
                <form onSubmit={(e) => handleMessageSend(e)}>
                    <TextInput
                        value={message}
                        onChange={(e) => setMessage(e.currentTarget.value)}
                        placeholder="Type a message..."
                        rightSectionPointerEvents="all"
                        rightSectionWidth={42}
                        rightSection={
                            <ActionIcon
                                type="submit"
                                variant="subtle"
                                size={32}
                            >
                                <IconSend2 stroke={2} />
                            </ActionIcon>
                        }
                        size="lg"
                    />
                </form>
            </Box>
        </Flex>
    );
}
