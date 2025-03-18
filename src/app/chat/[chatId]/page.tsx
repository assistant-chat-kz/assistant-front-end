"use client";

import { useParams } from "next/navigation";
import ChatComponent from "@/components/ChatComponent/ChatComponent";
import { useEffect } from "react";
import { chatService } from "@/app/services/chat.service";

export default function ChatPage() {
    const { chatId } = useParams();
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") ?? undefined : undefined;

    useEffect(() => {
        if (!chatId || !userId) return; // Проверяем, есть ли chatId и userId

        const createChat = async () => {
            try {
                await chatService.createChat(
                    chatId,
                    [{ title: 'Ассистент', text: 'Привет! Я ваш психолог-ассистент. Чем могу помочь?', position: 'left' }],
                    ['Ассистент', userId]
                );
            } catch (error) {
                console.error('Ошибка создания чата:', error);
            }
        };

        createChat();
    }, [chatId, userId]); // useEffect срабатывает при изменении chatId и userId

    return <ChatComponent />;
}
