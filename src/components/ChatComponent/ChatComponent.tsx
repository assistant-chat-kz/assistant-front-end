'use client'

import { useEffect, useRef, useState } from "react";
import { MessageBox } from "react-chat-elements";
import { useUser } from "@/app/hooks/useUser";
import { usePsy } from "@/app/hooks/usePsy";
import { useRouter } from "next/navigation";

import "react-chat-elements/dist/main.css";
import { axiosClassic } from "@/api/interceptors";
import { useChat } from "@/app/hooks/useChat";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from '../../app/hooks/useSocket'
import { useCallPsy } from "@/app/hooks/useCallPsy";
import { useConsultation } from "@/app/hooks/useConsultation";
import { usePsyInChat } from "@/app/hooks/usePsyInChat";
import Modal from '@/components/Modal/Modal'
import SurveyComponent from "../Survey/SurveyComponent";
import { IUserResponce } from "@/types/users.types";
import { IPsyResponce } from "@/types/psy.types";


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
    const [openModal, setOpenModal] = useState(false)
    const [openModalLogout, setOpenModalLogout] = useState(false)
    const [showCallPsyButton, setShowCallPsyButton] = useState(false);

    const [currentUser, setCurrentUser] = useState<IUserResponce | IPsyResponce>()
    const [showSurvey, setShowSurvey] = useState(false)

    const router = useRouter()
    const queryClient = useQueryClient();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") ?? undefined : undefined;

    const { data: user, isLoading, error } = useUser(userId)
    const { data: psy, } = usePsy(userId)
    const { data: chat } = useChat(chatId)

    const { data: consultation } = useConsultation(chatId, userId)
    const { callPsychologist } = useCallPsy()
    const { psyInChat } = usePsyInChat()


    const userMessage = {
        position: psy ? "left" : "right",
        // type: "text",
        title: psy ? psy.name : user?.name,
        text: input,
    };

    //@ts-ignore
    const socket = useSocket(userId)

    useEffect(() => {
        setCurrentUser(user ? user : psy)
        updateMessagesInChat();
        if (psy && chatId) {
            callPsychologist(chatId, false)
        }
    }, [messagesInChat, psy, chatId, socket]);


    useEffect(() => {
        if (!socket || !chatId) return;

        socket.emit("joinChat", chatId);
        console.log(`🔗 Присоединился к чату: ${chatId}`);

        socket.on("newMessage", (newMessage: IMessage) => {
            console.log("📩 Новое сообщение из WebSocket:", newMessage);



            const reverseMessage = currentUser?.name !== newMessage.title
                ?
                { ...newMessage, position: 'left' } :
                { ...newMessage, position: 'right' }


            setMessages((prev) => {
                const updatedMessages = [...prev, reverseMessage];
                const reverseMessages = updatedMessages.map(message => ({
                    ...message,
                    position: message.position === 'left' ? 'right' : 'left'
                }))
                return updatedMessages
            });

        });

        socket.on("userJoined", ({ members: newMembers }) => {
            console.log(`👤 Обновленный список участников:`, newMembers);
            if (psy) psyInChat(chatId, psy.id)
            //@ts-ignore
            setMembers((prev) => {
                const isDifferent = JSON.stringify(prev) !== JSON.stringify(newMembers);
                return isDifferent ? newMembers : prev;
            });
        });


        socket.on("userLeave", ({ userId, members: newMembers }) => {
            console.log(`🚪 Пользователь ${userId} вышел из чата, обновляем участников`, newMembers);
            //@ts-ignore
            setMembers((prev) => {
                const isDifferent = JSON.stringify(prev) !== JSON.stringify(newMembers);
                return isDifferent ? newMembers : prev;
            });
        });

        socket.on("send-survey", ({ chatId }) => {
            console.log("📋 Пришёл опрос:", chatId);
            setShowSurvey(true);
        });



        return () => {
            socket.off("newMessage");
            socket.off("userJoined");
            socket.off("userLeave");
            socket.off("send-survey");
        };
    }, [socket, chatId, currentUser]);


    useEffect(() => {
        if (!isLoading) {
            if (!psy && !user) {
                router.push("/login");
            }
        }
    }, [user, isLoading, router]);

    const updateMessagesInChat = () => {
        if (messagesInChat) {
            setMessages(messagesInChat)

            if (psy && messagesInChat.length > 0) {

                setMessages(messages => messages.map(msg => ({
                    ...msg,
                    position: msg.position === 'left' ? 'right' : 'left'
                })));
            }
        }
    }



    const handleLeaveChat = () => {
        socket?.emit("leaveChat", chatId);
        router.push('/chatsList')
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userId')
        router.push('/login')
    }

    const sendMessage = () => {
        if (!input.trim()) return;

        console.log("📨 Отправка сообщения:", input);


        console.log(userMessage, 'userMessage')

        socket?.emit("sendMessage", { chatId, message: userMessage });



        setInput("");
    };

    //@ts-ignore
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        setInput("");

        try {

            let data;

            if (chat?.members.length === 1 || chat?.members.length !== 3 && members.length !== 3 && chat?.members.includes('Ассистент')) {
                const lastFiveMessages = chat?.messages?.slice(-10).map((message: any) => {
                    const role = message.author === "Ассистент" ? "Психолог" : "Пользователь";
                    return `${role}: ${message.text}`;
                }).join('\n') || "";



                const res = await axiosClassic.post("yandex-gpt/generate", JSON.stringify({
                    prompt: `Ты профессиональный психолог-ассистент. 
            Отправляй ТОЛЬКО короткие ответы. Общайся так, чтобы поддерживать, 
            давать полезные советы и помогать пользователю разобраться в своих чувствах. Если пользователь пишет на другом языке, отвечай на этом языке.
            
            ${lastFiveMessages}
            Пользователь: ${input}
            Психолог:`,
                }));

                data = await res.data;

                console.log(lastFiveMessages)


                const botMessage = {
                    position: "left",
                    // type: "text",
                    title: "Ассистент",
                    text: data.response,
                };

                //@ts-ignore
                setMessages((prev) => [...prev, userMessage, botMessage]);

                await axiosClassic.put(`/chat/${chatId}`, { chatId: chatId, messages: [userMessage, botMessage] })
            } else {

                sendMessage()

                await axiosClassic.put(`/chat/${chatId}`, { chatId: chatId, messages: [userMessage] })
            }

            setInput("")
        } catch (error) {
            console.error("Error fetching response:", error);
        }
    };



    const handleOpenModal = () => {
        setOpenModal(true)
    }


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="h-[100dvh] flex flex-col mx-auto border border-gray-300 p-4 rounded-lg overflow-hidden">
            <Modal title={"Подтвердите"} content={"Вы уверены что хотите выйти из чата?"} openModal={openModal} setOpenModal={setOpenModal} action={handleLeaveChat} />
            <Modal title={"Подтвердите"} content={"Вы уверены что хотите выйти из аккаунта?"} openModal={openModalLogout} setOpenModal={setOpenModalLogout} action={handleLogout} />
            <div className="flex-1 overflow-auto p-2 bg-white rounded-lg">
                {messages.map((msg, index) => (
                    //@ts-ignore
                    <MessageBox key={index} type="text" {...msg} />
                ))}
                <div ref={messagesEndRef} />
                {showSurvey && user && !psy ? <SurveyComponent chatId={chatId} user={user} psyId={chat?.psy} /> : undefined}
            </div>

            <form onSubmit={handleSubmit} className="flex mt-4 gap-2 flex-wrap">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
                <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-lg">Отправить</button>
                <button type="submit" onClick={() => setOpenModalLogout(true)} className="ml-2 p-2 bg-yellow-500 text-white rounded-lg">Выйти из аккаунта</button>
                {psy ?
                    <button type="button" onClick={handleOpenModal} className="ml-2 p-2 bg-red-500 text-white rounded-lg">Выйти из чата</button>
                    :
                    !showCallPsyButton ? chat?.call ? <button type="button" className="ml-2 p-2 bg-red-500 text-white rounded-lg">Вы вызвали психолога</button>
                        : <button type="button" onClick={() => callPsychologist(chatId, true)} className="ml-2 p-2 bg-green-500 text-white rounded-lg">Позвать психолога</button> : undefined}
            </form>
        </div>

    );
}
