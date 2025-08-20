"use client";

import { useParams, useRouter } from "next/navigation";
import ChatComponent from "@/components/ChatComponent/ChatComponent";
import { useChat } from "@/app/hooks/useChat";
import { getUserId } from "@/app/hooks/getUserId";


export default function ChatPage() {

    const params = useParams() as { chatId: string };

    const { chatId } = params
    const router = useRouter()

    const userId = getUserId()

    const { data: chat, isLoading } = useChat(chatId)

    const messagesInChat = chat?.messages

    return !isLoading ? <ChatComponent chatId={chatId} messagesInChat={messagesInChat} /> : 'Loading...';
}
