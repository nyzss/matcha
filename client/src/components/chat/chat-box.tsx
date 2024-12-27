"use client";

import { fetchConversation } from "@/lib/api";
import { IConversation } from "@/types/types";
import {
    ActionIcon,
    Avatar,
    Divider,
    Flex,
    ScrollArea,
    Title,
} from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ChatBox({ chatId }: { chatId: string }) {
    const [conversation, setConversation] = useState<IConversation>();
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

    return (
        <Flex direction={"column"} gap={"xs"}>
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
            <ScrollArea h={"100%"}>{/* <div>{chatId}</div> */}</ScrollArea>
        </Flex>
    );
}
