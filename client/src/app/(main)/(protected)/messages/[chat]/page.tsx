import ChatBox from "@/components/chat/chat-box";

export default async function ChatPage({
    params,
}: {
    params: Promise<{ chat: string }>;
}) {
    const chat = (await params).chat;

    return (
        <>
            <ChatBox></ChatBox>
            <div>{chat}</div>
        </>
    );
}
