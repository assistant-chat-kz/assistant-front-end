"use client";

import { useAllChats } from "../hooks/useAllChats";
import { getUserId } from "../hooks/getUserId";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { chatService } from "../services/chat.service";
import { useEffect } from "react";
import { axiosClassic } from "@/api/interceptors";

export default function Chat() {
    const { data: chats, isLoading } = useAllChats();
    const router = useRouter();

    const userId: any = getUserId();
    const userIdNoAuth = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    const currentUserId = userId ? userId : userIdNoAuth;

    useEffect(() => {
        const initChat = async () => {
            if (!isLoading) {
                if (chats) {
                    const findChat = chats.find(chat =>
                        chat.members.find(member => member === currentUserId)
                    if (findChat) {
                        router.push(`chat/${findChat.chatId}`);
                    } else {
                        const randomChatId = nanoid(10);
                        const checkUserId = currentUserId ? currentUserId : randomChatId;
                        localStorage.setItem("userId", randomChatId);

                        try {
                            await chatService.createChat(
                                randomChatId,
                                [
                                    {
                                        title: "Assistant",
                                        text: "Hello! I'm your psychological assistant. How can I help you today?",
                                        position: "left",
                                    },
                                ],
                                ["Assistant", checkUserId]
                            );

                            try {
                                const response = await axiosClassic.post(
                                    "/auth/createUserNoAuth",
                                    { id: randomChatId }
                                );
                                alert("Registration successful");
                            } catch (error: any) {
                                console.error(error.response?.data?.message || "Registration failed");
                            }

                            router.push(`/chat/${randomChatId}?initMessage=${encodeURIComponent("Hello! I'm your psychological assistant. How can I help you today?")}`);
                        } catch (error) {
                            console.error("Error creating chat:", error);
                        }
                    }
                }
            }
        };

        initChat();
    }, [chats, currentUserId, isLoading, router]);

    return <div>Loading...</div>;
}
