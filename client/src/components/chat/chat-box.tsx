"use client";

import { fetchConversation } from "@/lib/api";
import { IConversation } from "@/types/types";
import { Avatar, Flex } from "@mantine/core";
import React, { useEffect, useState } from "react";

export default function ChatBox({ chatId }: { chatId: string }) {
    const [conversation, setConversation] = useState<IConversation>();

    useEffect(() => {
        fetchConversation(chatId).then((data) => setConversation(data));
    }, [chatId]);

    return (
        <Flex direction={"column"}>
            <Flex>
                <Avatar
                    color="initials"
                    name={`${conversation?.users[0].firstName} ${conversation?.users[0].lastName}`}
                    size={100}
                    mt={8}
                />
            </Flex>
            <div>{chatId}</div>
        </Flex>
    );
}
