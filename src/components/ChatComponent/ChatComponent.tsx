'use client'

import { useEffect, useState } from "react";
import { MessageBox } from "react-chat-elements";
import { useUser } from "@/app/hooks/useUser";
import { usePsy } from "@/app/hooks/usePsy";
import { useRouter } from "next/navigation";

import "react-chat-elements/dist/main.css";
import { axiosClassic } from "@/api/interceptors";
import { useChat } from "@/app/hooks/useChat";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from '../../app/hooks/useSocket'

interface IMessage {
    //@ts-ignore
    position: left | right;
    title: string;
    text: string
}

export default function ChatComponent({ chatId, messagesInChat }: { chatId?: string; messagesInChat?: any[] }) {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [input, setInput] = useState("");
    const [members, setMembers] = useState<any>([])

    const router = useRouter()
    const queryClient = useQueryClient();

    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") ?? undefined : undefined;

    const { data: user, isLoading, error } = useUser(userId)
    const { data: psy, } = usePsy(userId)
    const { data: chat } = useChat(chatId)

    const socket = useSocket(userId)

    console.log(messages, 'messages')

    const updateMessagesInChat = () => {
        console.log(chat?.messages, 'messagein chat')
        if (messagesInChat) {
            setMessages(messagesInChat)

            if (psy && messagesInChat.length > 0) {


                setMessages(chat?.messages)

                setMessages(messages => messages.map(msg => ({
                    ...msg,
                    position: msg.position === 'left' ? 'right' : 'left'
                })));
            }
        }
    }

    // для психолога сврй сценарий сделать

    useEffect(() => {
        updateMessagesInChat();
    }, [messagesInChat, psy, chatId, socket]);



    useEffect(() => {
        if (!socket || !chatId) return;

        socket.emit("joinChat", chatId);
        console.log(`🔗 Присоединился к чату: ${chatId}`);

        socket.on("newMessage", (newMessage: IMessage) => {
            console.log("📩 Новое сообщение из WebSocket:", newMessage);

            const reverseMessage = { ...newMessage, position: "left" }

            setMessages((prev) => {
                const updatedMessages = [...prev, reverseMessage];
                const reverseMessages = updatedMessages.map(message => ({
                    ...message,
                    position: message.position === 'left' ? 'right' : 'left'
                }))
                // return psy ? reverseMessages : updatedMessages;
                return updatedMessages
            });

        });

        socket.on("userJoined", ({ members: newMembers }) => {
            console.log(`👤 Обновленный список участников:`, newMembers);

            setMembers((prev) => {
                const isDifferent = JSON.stringify(prev) !== JSON.stringify(newMembers);
                return isDifferent ? newMembers : prev;
            });
        });


        socket.on("userLeave", ({ userId, members: newMembers }) => {
            console.log(`🚪 Пользователь ${userId} вышел из чата, обновляем участников`, newMembers);

            setMembers((prev) => {
                const isDifferent = JSON.stringify(prev) !== JSON.stringify(newMembers);
                return isDifferent ? newMembers : prev;
            });
        });


        const handleBeforeUnload = () => {
            socket.emit("leaveChat", chatId);
        };

        window.addEventListener("beforeunload", handleBeforeUnload);



        return () => {
            socket.off("newMessage");
            socket.off("userJoined");
            socket.off("userLeave");
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [socket, chatId]);


    const sendMessage = () => {
        if (!input.trim()) return;

        updateMessagesInChat();

        console.log("📨 Отправка сообщения:", input);

        const userMessage = {
            position: psy ? "left" : "right",
            title: psy ? psy.name : user?.name,
            text: input,
        };

        setMessages((prev) => [...prev, userMessage]);



        socket?.emit("sendMessage", { chatId, message: userMessage });



        setInput("");
    };


    useEffect(() => {
        if (!userId && !isLoading) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    //@ts-ignore
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        setInput("");

        const userMessage = {
            position: psy ? "left" : "right",
            // type: "text",
            title: psy ? psy.name : user?.name,
            text: input,
        };

        //@ts-ignore
        setMessages((prev) => [...prev, userMessage]);

        try {

            let data;

            if (chat?.members.length !== 3 && members.length !== 3) {
                const lastFiveMessage = chat ? chat.messages
                    .map((message: any, index: number) =>
                        `${index % 2 === 0 ? 'Пользователь' : 'Психолог'}: ${message?.text}`
                    )
                    .join('\n') : ""


                const res = await axiosClassic.post("yandex-gpt/generate", JSON.stringify({
                    prompt: `Ты профессиональный психолог-ассистент. 
            Отправляй ТОЛЬКО короткие ответы. Общайся так, чтобы поддерживать, 
            давать полезные советы и помогать пользователю разобраться в своих чувствах. 
            
            ${lastFiveMessage}
            Пользователь: ${input}
            Психолог:`,
                }));

                data = await res.data;


                const botMessage = {
                    position: "left",
                    // type: "text",
                    title: "Ассистент",
                    text: data.response,
                };

                //@ts-ignore
                setMessages((prev) => [...prev, botMessage]);

                await axiosClassic.put(`/chat/${chatId}`, { chatId: chatId, messages: [userMessage, botMessage] })
            } else {
                setMessages((prev) => [...prev]);

                sendMessage()

                await axiosClassic.put(`/chat/${chatId}`, { chatId: chatId, messages: [userMessage] })
            }



            //@ts-ignore
            queryClient.invalidateQueries(["chat", chatId])

            updateMessagesInChat();

            setInput("")
        } catch (error) {
            console.error("Error fetching response:", error);
        }


    };

    // const messagesRender = () => {
    //     if (psy && testMessages) {
    //         return <MessageBox key={testMessages?.title} type="text" {...testMessages} />
    //     } else {
    //         return messages.map((msg, index) => (
    //             //@ts-ignore
    //             <MessageBox key={index} type="text" {...msg} />
    //         ))
    //     }
    // }

    return (
        <div className="h-[100dvh] flex flex-col mx-auto border border-gray-300 p-4 rounded-lg overflow-hidden">
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
