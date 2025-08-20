"use client";

import { useAllChats } from "../hooks/useAllChats";
import { getUserId } from "../hooks/getUserId";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { chatService } from "../services/chat.service";
import { useEffect } from "react";

export default function Chat() {
    const { data: chats, isLoading } = useAllChats();
    const router = useRouter();

    const userId: any = getUserId();
    const userIdNoAuth = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    const currentUserId = userId ? userId : userIdNoAuth;



    useEffect(() => {
        if (!isLoading) {
            if (chats) {
                const findChat = chats.find(chat =>
                    chat.members.find(member => member === currentUserId)
                );
                console.log(findChat, 'findChat')
                if (findChat) {
                    router.push(`chat/${findChat.chatId}`);
                } else {
                    const randomChatId = nanoid(10);
                    const checkUserId = currentUserId ? currentUserId : randomChatId;
                    localStorage.setItem("userId", randomChatId);

                    try {
                        chatService.createChat(
                            randomChatId,
                            [
                                {
                                    title: "Ассистент",
                                    text: "Привет! Я ваш психолог-ассистент. Чем могу помочь?",
                                    position: "left",
                                },
                            ],
                            ["Ассистент", checkUserId]
                        );

                        router.push(`/chat/${randomChatId}?initMessage=${encodeURIComponent("Привет! Я ваш психолог-ассистент. Чем могу помочь?")}`);

                    } catch (error) {
                        console.error("Ошибка создания чата:", error);
                    }
                }
            }
        }
    }, [chats, currentUserId, isLoading, router]);

    return <div>Loading...</div>;
}
