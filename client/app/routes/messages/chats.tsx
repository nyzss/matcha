import { useAuth } from "~/contexts/auth-provider";
import { fetchAllConversations, getImage } from "~/lib/api";
import {
    Avatar,
    Box,
    Button,
    Flex,
    Group,
    Modal,
    NumberInput,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/chats";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Messages | matcha " }];
}

export default function MessagesPage() {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState<IConversation[]>([]);

    const { user } = useAuth();

    useEffect(() => {
        const getConversations = async () => {
            setConversations(await fetchAllConversations(user!.id));
        };
        getConversations();
    }, [user]);

    return (
        <Flex direction={"column"} gap={"xs"} h={"100%"}>
            <Group w={"100%"}>
                <TextInput
                    leftSection={<IconSearch size={16} />}
                    leftSectionPointerEvents="none"
                    placeholder="Search conversation..."
                    width={"100%"}
                    flex={1}
                />
                <Button
                    leftSection={<IconPlus size={16} />}
                    onClick={() => navigate("/matches")}
                >
                    New chat
                </Button>
            </Group>
            {(conversations &&
                conversations.length > 0 &&
                conversations.map((conv) => (
                    <Box key={conv.id}>
                        <Link
                            to={"/messages/" + conv.id}
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
                                        name={`${conv.users[0].firstName} ${conv.users[0].lastName}`}
                                        size={60}
                                        src={getImage(conv.users[0].avatar)}
                                    />
                                    <Flex direction={"column"}>
                                        <Text
                                            size="lg"
                                            fw={"bold"}
                                            c={"bright"}
                                        >
                                            {conv.users[0].firstName}{" "}
                                            {conv.users[0].lastName}
                                        </Text>
                                        <Text size="md" c={"gray"}>
                                            {`@${conv.users
                                                .map((user) => user.username)
                                                .join(", @")}`}
                                        </Text>
                                        <Text
                                            size="sm"
                                            fw={"lighter"}
                                            truncate="end"
                                            c={"bright"}
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
                ))) || (
                <Flex
                    justify={"center"}
                    align={"center"}
                    h={"100%"}
                    direction={"column"}
                    gap={"sm"}
                >
                    <Title>No conversations</Title>
                    <Text c={"dimmed"}>
                        Start a new conversation by clicking on the "New chat"
                        button
                    </Text>
                </Flex>
            )}
        </Flex>
    );
}
