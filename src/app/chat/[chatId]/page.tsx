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


    console.log(userId, 'userIduserId')
    if (!userId) {
        router.push('/login')
    }

    const { data: chat } = useChat(chatId)

    const messagesInChat = chat?.messages

    return <ChatComponent chatId={chatId} messagesInChat={messagesInChat} />;
}
