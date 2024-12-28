"use client";

import { useAuth } from "@/contexts/auth-provider";
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
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export default function ChatBox({ chatId }: { chatId: string }) {
    const [conversation, setConversation] = useState<IConversation>();
    const [messageHistory, setMessageHistory] = useState<TMessageHistory>();
    const [message, setMessage] = useState<string>("");
    const router = useRouter();

    const { user } = useAuth();
    const viewport = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchConversation(chatId, user!.id)
            .then((data) => {
                console.log(data);
                setConversation(data);
            })
            .catch(() => {
                router.push("/messages");
            });
    }, [chatId, router, user]);

    useEffect(() => {
        fetchMessageHistory(chatId)
            .then((data) => {
                setMessageHistory(data);
                scrollToBottom();
            })
            .catch(() => {
                notifications.show({
                    title: "An error occurred",
                    message: "Couldn't fetch message history",
                    color: "red",
                });
            });
    }, [chatId]);

    useEffect(() => {
        dayjs.extend(isToday);
        dayjs.extend(isYesterday);
        dayjs.extend(utc);
        dayjs.extend(timezone);
        dayjs.tz.setDefault(dayjs.tz.guess());
    }, []);

    // const computeMessages = useMemo(() => {
    //     const all = messageHistory?.messages;
    // }, [messageHistory])

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

    const scrollToBottom = () => {
        viewport.current!.scrollTo({
            top: viewport.current!.scrollHeight,
            behavior: "smooth",
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
            <ScrollArea
                h={"100%"}
                scrollbars="y"
                viewportRef={viewport}
                offsetScrollbars
            >
                <Flex direction={"column"} gap={"md"} pb={100} pt={50}>
                    {messageHistory &&
                        messageHistory.messages.map((msg) => {
                            const isMe = msg.sender.id === user?.id;

                            const formatDate = (date: Date) => {
                                if (dayjs(date).isToday()) {
                                    return `Today at ${dayjs(date).format(
                                        "HH:mm"
                                    )}`;
                                } else if (dayjs(date).isYesterday()) {
                                    return `Yesterday at ${dayjs(date).format(
                                        "HH:mm"
                                    )}`;
                                } else {
                                    return dayjs(date).format(
                                        "DD/MM/YYYY HH:mm"
                                    );
                                }
                            };

                            return (
                                <Flex
                                    key={msg.id}
                                    direction={"column"}
                                    gap={"xs"}
                                    align={isMe ? "flex-end" : "flex-start"}
                                >
                                    <Paper
                                        radius={"md"}
                                        shadow="sm"
                                        withBorder
                                        maw={"70%"}
                                        bg={
                                            isMe
                                                ? "var(--mantine-primary-color-light)"
                                                : "var(--mantine-color-blue-light)"
                                        }
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
                                    <Text size="xs" c={"gray"} fw={400}>
                                        {formatDate(msg.sentAt)}
                                    </Text>
                                </Flex>
                            );
                        })}
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
                        radius={"lg"}
                    />
                </form>
            </Box>
        </Flex>
    );
}
