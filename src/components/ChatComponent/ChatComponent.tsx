'use client'
import { useEffect, useRef, useState } from "react";
import { MessageBox } from "react-chat-elements";
import { useUser } from "@/app/hooks/useUser";
import { usePsy } from "@/app/hooks/usePsy";
import { useRouter, useSearchParams } from "next/navigation";
import "react-chat-elements/dist/main.css";
import { axiosClassic } from "@/api/interceptors";
import { useChat } from "@/app/hooks/useChat";
import { useSocket } from '../../app/hooks/useSocket'
import { useCallPsy } from "@/app/hooks/useCallPsy";
import { useConsultation } from "@/app/hooks/useConsultation";
import { usePsyInChat } from "@/app/hooks/usePsyInChat";
import Modal from '@/components/Modal/Modal'
import SurveyComponent from "../Survey/SurveyComponent";
import { IUserResponce } from "@/types/users.types";
import { IPsyResponce } from "@/types/psy.types";
import { userService } from "@/app/services/users.service";

interface IMessage {
    position: "left" | "right";
    title: string;
    text: string;
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
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") ?? undefined : undefined;

    const { data: user, isLoading } = useUser(userId)
    const { data: psy } = usePsy(userId)
    const { data: chat } = useChat(chatId)
    const { data: consultation } = useConsultation(chatId, userId)
    const { callPsychologist } = useCallPsy()
    const { psyInChat } = usePsyInChat()
    const searchParams = useSearchParams();
    const initMessage = searchParams?.get("initMessage");

    const visitUser = async () => {
        try {
            if (userId) {
                await userService.visitUser(userId);
                console.log("+ Визит");
            }
        } catch (e) {
            console.error("Ошибка", e);
        }
    };

    useEffect(() => {
        visitUser();
    }, [userId]);

    const noAuthUserName = user?.name ? user.name : 'Вы'

    const userMessage: IMessage = {
        position: psy ? "left" : "right",
        title: psy ? psy.name : noAuthUserName,
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

            const reverseMessage =
                currentUser?.name !== newMessage.title && noAuthUserName !== 'Вы'
                    ? { ...newMessage, position: 'left' }
                    : { ...newMessage, position: 'right' }
            //@ts-ignore
            setMessages((prev) => [...prev, reverseMessage]);
        });

        socket.on("userJoined", ({ members: newMembers }) => {
            console.log("👤 Обновленный список участников:", newMembers);
            if (psy) psyInChat(chatId, psy.id)

            setMembers((prev: any) => {
                const isDifferent = JSON.stringify(prev) !== JSON.stringify(newMembers);
                return isDifferent ? newMembers : prev;
            });
        });

        socket.on("userLeave", ({ userId, members: newMembers }) => {
            console.log(`🚪 Пользователь ${userId} вышел из чата, обновляем участников`, newMembers);
            setMembers((prev: any) => {
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

    const updateMessagesInChat = () => {
        if (messagesInChat) {
            setMessages(messagesInChat)

            if (psy && messagesInChat.length > 0) {
                setMessages(messages =>
                    messages.map(msg => ({
                        ...msg,
                        position: msg.position === 'left' ? 'right' : 'left'
                    }))
                );
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

    //@ts-ignore
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const messageToSend = { ...userMessage, text: input };

        setInput("");

        try {
            let data;

            // если чат только с ботом
            if (chat?.members.length === 1 || chat?.members.length !== 3 && members.length !== 3 && chat?.members.includes('Ассистент')) {
                const lastFiveMessages =
                    chat?.messages?.slice(-10).map((message: any) => {
                        const role = message.author === "Ассистент" ? "Психолог" : "Пользователь";
                        return `${role}: ${message.text}`;
                    }).join('\n') || "";

                const res = await axiosClassic.post("yandex-gpt/generate", JSON.stringify({
                    prompt: `Ты профессиональный психолог-ассистент. Отправляй ТОЛЬКО короткие ответы. Общайся так, чтобы поддерживать, давать полезные советы и помогать пользователю разобраться в своих чувствах. Если пользователь пишет на другом языке, отвечай на этом языке. Давай конкретные рекомендации чтобы помочь человеку. ${lastFiveMessages} Пользователь: ${input} Психолог:`,
                }));

                data = await res.data;

                const botMessage: IMessage = {
                    position: "left",
                    title: "Ассистент",
                    text: data.response,
                };

                setMessages((prev) => [...prev, messageToSend, botMessage]);

                // сохраняем в БД и пользователя, и ответ бота
                await axiosClassic.put(`/chat/${chatId}`, {
                    chatId: chatId,
                    messages: [messageToSend, botMessage]
                })
            } else {
                // если живой собеседник
                socket?.emit("sendMessage", { chatId, message: messageToSend })
                setMessages((prev) => [...prev, messageToSend]);

                await axiosClassic.put(`/chat/${chatId}`, {
                    chatId: chatId,
                    messages: [messageToSend]
                })
            }

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
            <Modal
                title={"Подтвердите"}
                content={"Вы уверены что хотите выйти из чата?"}
                openModal={openModal}
                setOpenModal={setOpenModal}
                action={handleLeaveChat}
            />

            <Modal
                title={"Подтвердите"}
                content={"Вы уверены что хотите выйти из аккаунта?"}
                openModal={openModalLogout}
                setOpenModal={setOpenModalLogout}
                action={handleLogout}
            />

            <div className="flex-1 overflow-auto p-2 bg-white rounded-lg">
                {messages.map((msg, index) => (
                    //@ts-ignore
                    <MessageBox key={index} type="text" {...msg} />
                ))}
                <div ref={messagesEndRef} />

                {showSurvey && userId && !psy
                    ? <SurveyComponent chatId={chatId} user={user || userId} psyId={chat?.psy} />
                    : undefined}
            </div>

            <form onSubmit={handleSubmit} className="flex mt-4 gap-2 flex-wrap">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
                <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
                    Отправить
                </button>
                <button
                    type="button"
                    onClick={() => setOpenModalLogout(true)}
                    className="ml-2 p-2 bg-yellow-500 text-white rounded-lg"
                >
                    Выйти из аккаунта
                </button>

                {psy ? (
                    <button
                        type="button"
                        onClick={handleOpenModal}
                        className="ml-2 p-2 bg-red-500 text-white rounded-lg"
                    >
                        Выйти из чата
                    </button>
                ) : !showCallPsyButton ? (
                    chat?.call ? (
                        <button
                            type="button"
                            className="ml-2 p-2 bg-red-500 text-white rounded-lg"
                        >
                            Вы вызвали психолога
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => callPsychologist(chatId, true)}
                            className="ml-2 p-2 bg-green-500 text-white rounded-lg"
                        >
                            Позвать психолога
                        </button>
                    )
                ) : undefined}
            </form>
        </div>
    );
}
