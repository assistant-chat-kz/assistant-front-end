'use client'

import { useEffect, useState } from "react";
import { MessageBox } from "react-chat-elements";
import { useUser } from "@/app/hooks/useUser";
import { useRouter } from "next/navigation";

import "react-chat-elements/dist/main.css";
import { axiosClassic } from "@/api/interceptors";
import { useChatHistory } from "@/app/hooks/useChatHistory";

interface IMessage {
    //@ts-ignore
    position: left | right;
    // type: "text",
    title: string;
    text: string
}

export default function ChatComponent() {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [input, setInput] = useState("");

    const router = useRouter()

    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") ?? undefined : undefined;

    const { data: user, isLoading, error } = useUser(userId)

    const { data: chat } = useChatHistory(userId)

    useEffect(() => {
        if (!user && !isLoading) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        setMessages([
            {
                position: "left",
                // type: "text",
                title: "Ассистент",
                text: "Привет! Я ваш психолог-ассистент. Чем могу помочь?",
            },
        ])
    }, [])



    //@ts-ignore
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        setInput("");

        const userMessage = {
            position: "right",
            // type: "text",
            title: user?.name,
            text: input,
        };

        //@ts-ignore
        setMessages((prev) => [...prev, userMessage]);

        try {

            const lastFiveMessage = chat.messages
                .map((message: any, index: number) =>
                    `${index % 2 === 0 ? 'Пользователь' : 'Психолог'}: ${message?.text}`
                )
                .join('\n')


            const res = await axiosClassic.post("yandex-gpt/generate", JSON.stringify({
                prompt: `Ты профессиональный психолог-ассистент. 
            Отправляй ТОЛЬКО короткие ответы. Общайся так, чтобы поддерживать, 
            давать полезные советы и помогать пользователю разобраться в своих чувствах. 
            
            ${lastFiveMessage}
            Пользователь: ${input}
            Психолог:`,
            }));

            const data = await res.data;

            const botMessage = {
                position: "left",
                // type: "text",
                title: "Ассистент",
                text: data.response,
            };

            //@ts-ignore
            setMessages((prev) => [...prev, botMessage]);

            await axiosClassic.put(`/chat-history/${userId}`, { userId: userId, messages: [userMessage, botMessage] })

            setInput("")
        } catch (error) {
            console.error("Error fetching response:", error);
        }


    };

    return (
        <div className="max-w-md min-h-screen flex flex-col mx-auto border border-gray-300 p-4 rounded-lg">
            <div className="flex-1 overflow-auto p-2 bg-white rounded-lg">
                {messages.map((msg, index) => (
                    //@ts-ignore
                    <MessageBox key={index} type="text" {...msg} />
                ))}
            </div>

            <form onSubmit={handleSubmit} className="flex mt-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
                <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-lg">Отправить</button>
            </form>
        </div>

    );
}
