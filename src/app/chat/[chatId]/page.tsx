"use client";

import { useParams } from "next/navigation";
import ChatComponent from "@/components/ChatComponent/ChatComponent";
import { useChat } from "@/app/hooks/useChat";


export default function ChatPage() {
    const { chatId } = useParams();

    const { data: chat } = useChat(chatId)

    const messagesInChat = chat?.messages

    return <ChatComponent chatId={chatId} messagesInChat={messagesInChat} />;
}
