"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { HeartHandshake, LoaderCircle } from "lucide-react";
import { useAllChats } from "../hooks/useAllChats";
import { chatService } from "../services/chat.service";
import { axiosClassic } from "@/api/interceptors";

const WELCOME_MESSAGE =
    "Здравствуйте! Я рядом, чтобы спокойно выслушать и помочь разобраться. Что сейчас больше всего занимает ваши мысли?";

export default function Chat() {
    const { data: chats, isLoading } = useAllChats();
    const router = useRouter();

    useEffect(() => {
        if (isLoading || !chats) return;

        const initChat = async () => {
            let currentUserId = localStorage.getItem("userId");
            const existingChat = currentUserId
                ? chats.find((chat) => chat.members.includes(currentUserId as string))
                : undefined;

            if (existingChat) {
                router.replace(`/chat/${existingChat.chatId}`);
                return;
            }

            const chatId = nanoid(10);
            if (!currentUserId) {
                currentUserId = nanoid(14);
                localStorage.setItem("userId", currentUserId);
                localStorage.setItem("userSource", "OTHER");
                await axiosClassic.post("/auth/createUserNoAuth", { id: currentUserId });
            }

            await chatService.createChat(
                chatId,
                [{ title: "Assistant", text: WELCOME_MESSAGE, position: "left" }],
                ["Assistant", currentUserId],
            );
            router.replace(`/chat/${chatId}`);
        };

        initChat().catch((error) => console.error("Error creating chat:", error));
    }, [chats, isLoading, router]);

    return (
        <main className="grid min-h-dvh place-items-center px-6">
            <div className="text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-700 text-white shadow-lg">
                    <HeartHandshake className="h-7 w-7" />
                </span>
                <p className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-600">
                    <LoaderCircle className="h-4 w-4 animate-spin text-teal-700" /> Подготавливаем безопасный диалог…
                </p>
            </div>
        </main>
    );
}
