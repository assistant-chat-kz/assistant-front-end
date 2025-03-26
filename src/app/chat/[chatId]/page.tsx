"use client";

import { useParams, useRouter } from "next/navigation";
import ChatComponent from "@/components/ChatComponent/ChatComponent";
import { useChat } from "@/app/hooks/useChat";
import { getUserId } from "@/app/hooks/getUserId";


export default function ChatPage() {
    const { chatId } = useParams()
    const router = useRouter()

    const userId = getUserId()

    if (!userId) {
        router.push('/login')
    }

    console.log(userId)

    const { data: chat } = useChat(chatId)

    const messagesInChat = chat?.messages

    return <ChatComponent chatId={chatId} messagesInChat={messagesInChat} />;
}
