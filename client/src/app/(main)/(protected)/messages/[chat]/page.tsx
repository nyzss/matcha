import ChatBox from "@/components/chat/chat-box";

export default async function ChatPage({
    params,
}: {
    params: Promise<{ chat: string }>;
}) {
    const chatId = (await params).chat;

    return <ChatBox chatId={chatId} />;
}
