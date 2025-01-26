import { useAuth } from "~/contexts/auth-provider";
import { fetchAllConversations, mutateConversation } from "~/lib/api";
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
import { Link } from "react-router";
import type { Route } from "./+types/chats";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

export function meta({}: Route.MetaArgs) {
    return [{ title: "Messages | matcha " }];
}

export default function MessagesPage() {
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [opened, { open, close }] = useDisclosure();
    const [newChatId, setNewChatId] = useState<string | number>();
    const [error, setError] = useState<string>();

    const { user } = useAuth();

    useEffect(() => {
        const getConversations = async () => {
            setConversations(await fetchAllConversations(user!.id));
        };
        getConversations();
    }, [user]);

    const startChat = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!newChatId) return;

        mutateConversation(newChatId)
            .then((conv) => {
                setConversations([...conversations, conv]);
                close();
            })
            .catch(() => {
                setError("Couldn't start the conversation");
            });
    };

    return (
        <Flex direction={"column"} gap={"xs"} h={"100%"}>
            <Modal
                opened={opened}
                onClose={close}
                title="Start conversation"
                centered
            >
                <form onSubmit={startChat}>
                    <NumberInput
                        label="ID of user"
                        placeholder="Enter the ID of the user you want to chat with"
                        value={newChatId}
                        onChange={(e) => {
                            setNewChatId(e);
                            if (error) setError("");
                        }}
                        error={error}
                    />
                    <Button mt={"sm"} type="submit">
                        Start chat
                    </Button>
                </form>
            </Modal>
            <Group w={"100%"}>
                <TextInput
                    leftSection={<IconSearch size={16} />}
                    leftSectionPointerEvents="none"
                    placeholder="Search conversation..."
                    width={"100%"}
                    flex={1}
                />
                <Button leftSection={<IconPlus size={16} />} onClick={open}>
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
