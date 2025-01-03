import { useAuth } from "~/contexts/auth-provider";
import {
    fetchConversation,
    fetchMessageHistory,
    mutateMessage,
} from "~/lib/api";
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
import {
    IconChevronLeft,
    IconChevronRight,
    IconSend2,
} from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/single-chat";
import { socket } from "~/lib/socket";
import { useField } from "@mantine/form";
import { chatMessageSchema } from "~/lib/validation";

export default function SingleChat({
    params: { chatId },
}: Route.ComponentProps) {
    const [conversation, setConversation] = useState<IConversation>();
    const [messageHistory, setMessageHistory] = useState<TMessageHistory>();
    const navigate = useNavigate();

    const field = useField({
        initialValue: "",

        validate: (value) => {
            const v = chatMessageSchema.safeParse(value);

            return !v.success ? "Max 1000 characters" : null;
        },
    });

    const { user } = useAuth();
    const viewport = useRef<HTMLDivElement>(null);

    // helper func to add messages to the message history
    // we filter out the duplicates, sometimes the socket.io instance can be tricky and multiply
    // eg. when not cleaned up properly after useEffect()
    const addMessage = (msg: IMessage) => {
        setMessageHistory((prev) => {
            if (prev?.messages.some((el) => el.id === msg.id)) return prev;
            if (!prev) {
                return {
                    messages: [msg],
                    total: 1,
                };
            } else {
                return {
                    total: prev.total + 1,
                    messages: [...prev.messages, msg],
                };
            }
        });
    };

    useEffect(() => {
        fetchConversation(chatId, user!.id)
            .then((data) => {
                setConversation(data);
            })
            .catch(() => {
                navigate("/messages");
            });
    }, [chatId, user]);

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

    useEffect(() => {
        const updateWithMessage = (data: IMessage) => {
            if (data.conversationId === chatId) {
                addMessage(data);
                scrollToBottom();
            }
        };

        socket.on("MessageCreate", updateWithMessage);

        return () => {
            socket.removeAllListeners("MessageCreate");
        };
    }, []);

    const handleMessageSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!field.getValue()) return;

        if (await field.validate()) return;
        mutateMessage(chatId, field.getValue()).then(() => {
            field.setValue("");
        });
    };

    const scrollToBottom = (behavior: ScrollBehavior = "instant") => {
        viewport.current!.scrollTo({
            top: viewport.current!.scrollHeight,
            behavior,
        });
    };

    return (
        <Flex direction={"column"} gap={"xs"} h={"100%"}>
            <Flex
                direction={"row"}
                align={"center"}
                gap={"sm"}
                component={Link}
                to={"/profile/" + conversation?.users[0].username}
                style={{ textDecoration: "none" }}
                c="var(--mantine-color-dark)"
            >
                <ActionIcon
                    variant="transparent"
                    onClick={() => navigate("/messages")}
                >
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
                                const d = dayjs(date).add(1, "hour");
                                if (dayjs(d).isToday()) {
                                    return `Today at ${dayjs(d).format(
                                        "HH:mm"
                                    )}`;
                                } else if (dayjs(d).isYesterday()) {
                                    return `Yesterday at ${dayjs(d).format(
                                        "HH:mm"
                                    )}`;
                                } else {
                                    return dayjs(d).format("DD/MM/YYYY HH:mm");
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
                        {...field.getInputProps()}
                        placeholder="Type a message..."
                        rightSectionPointerEvents="all"
                        rightSectionWidth={42}
                        rightSection={
                            <ActionIcon
                                type="submit"
                                variant="filled"
                                size={32}
                                radius={"xl"}
                            >
                                <IconChevronRight size={24} stroke={2} />
                            </ActionIcon>
                        }
                        size="md"
                        radius={"xl"}
                    />
                </form>
            </Box>
        </Flex>
    );
}
