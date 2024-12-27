"use client";

import { fetchConversation } from "@/lib/api";
import { IConversation } from "@/types/types";
import {
    ActionIcon,
    Avatar,
    Box,
    Divider,
    Flex,
    ScrollArea,
    TextInput,
    Title,
} from "@mantine/core";
import { IconChevronLeft, IconSend2 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ChatBox({ chatId }: { chatId: string }) {
    const [conversation, setConversation] = useState<IConversation>();
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

    const handleMessageSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message) return;
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
            <ScrollArea></ScrollArea>
            <Box mt={"auto"}>
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
