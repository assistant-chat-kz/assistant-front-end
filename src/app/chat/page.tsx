"use client";

import { useAllChats } from "../hooks/useAllChats"
import { getUserId } from "../hooks/getUserId";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { chatService } from "../services/chat.service";

export default function Chat() {

    const { data: chats, isLoading } = useAllChats()
    const router = useRouter()

    const userId: any = getUserId()

    const findChat = chats?.find(chat => chat.members.find(member => member === userId))

    if (!isLoading) {
        if (findChat && userId) {
            router.push(`chat/${findChat.chatId}`)
        } else {
            const randomChatId = nanoid(10)
            try {
                chatService.createChat(
                    randomChatId,
                    [{ title: 'Ассистент', text: 'Привет! Я ваш психолог-ассистент. Чем могу помочь?', position: 'left' }],
                    ['Ассистент', userId]
                );

                router.push(`chat/${randomChatId}`)
            } catch (error) {
                console.error('Ошибка создания чата:', error);
            }
        }
    }

    return (
        <div>Loading...</div>
    )
}