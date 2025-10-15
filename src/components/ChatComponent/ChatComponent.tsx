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
import { LogOut } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Loading from "../Loading/Loading";

interface IMessage {
    position: "left" | "right";
    title: string;
    text: string;
}

export default function ChatComponent({ chatId, user, messagesInChat }: { chatId?: string; user?: IUserResponce; messagesInChat?: any[] }) {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [input, setInput] = useState("");
    const [members, setMembers] = useState<any>([])
    const [openModal, setOpenModal] = useState(false)
    const [openModalLogout, setOpenModalLogout] = useState(false)
    const [showCallPsyButton, setShowCallPsyButton] = useState(false);
    const [currentUser, setCurrentUser] = useState<IUserResponce | IPsyResponce>()
    const [showSurvey, setShowSurvey] = useState(false)
    const [loading, setLoading] = useState(false)



    const router = useRouter()
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") ?? undefined : undefined;

    const { data: psy } = usePsy(userId)
    const { data: chat } = useChat(chatId)
    const { data: consultation } = useConsultation(chatId, userId)
    const { callPsychologist } = useCallPsy()
    const { psyInChat } = usePsyInChat()
    const searchParams = useSearchParams();
    const initMessage = searchParams?.get("initMessage");

    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark";
        if (savedTheme) {
            setTheme(savedTheme);
            document.body.classList.toggle("dark", savedTheme === "dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.body.classList.toggle("dark", newTheme === "dark");
    };

    const visitUser = async () => {
        try {
            if (userId) {
                await userService.visitUser(userId);
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

        socket.on("newMessage", (newMessage: IMessage) => {

            const reverseMessage =
                currentUser?.name !== newMessage.title && noAuthUserName !== 'Вы'
                    ? { ...newMessage, position: 'left' }
                    : { ...newMessage, position: 'right' }
            //@ts-ignore
            setMessages((prev) => [...prev, reverseMessage]);
        });

        socket.on("userJoined", ({ members: newMembers }) => {
            if (psy) psyInChat(chatId, psy.id)

            setMembers((prev: any) => {
                const isDifferent = JSON.stringify(prev) !== JSON.stringify(newMembers);
                return isDifferent ? newMembers : prev;
            });
        });

        socket.on("userLeave", ({ userId, members: newMembers }) => {
            setMembers((prev: any) => {
                const isDifferent = JSON.stringify(prev) !== JSON.stringify(newMembers);
                return isDifferent ? newMembers : prev;
            });
        });

        socket.on("send-survey", ({ chatId }) => {
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

            if (chat?.members.length === 1 || chat?.members.length !== 3 && members.length !== 3 && chat?.members.includes('Ассистент')) {
                const lastFiveMessages =
                    chat?.messages?.slice(-10).map((message: any) => {
                        const role = message.author === "Ассистент" ? "Психолог" : "Пользователь";
                        return `${role}: ${message.text}`;
                    }).join('\n') || "";


                const prompt = `Ты — профессиональный психолог-ассистент, ведущий доверительный, человечный и глубокий разговор.  
                Твоя цель — помочь человеку понять себя, свои чувства и найти пути к внутреннему равновесию.

                **Стиль общения:**
                - Пиши естественно, как в живом диалоге. Не начинай с приветствий вроде "Привет" или "Здравствуйте" — просто продолжай разговор.
                - Тон — тёплый, эмпатичный, но без излишнего сюсюканья.
                - Показывай эмоциональное понимание: отражай чувства собеседника ("Похоже, тебе сейчас тревожно..."), объясняй, почему человек может так себя чувствовать.
                - Объясняй смысл своих советов: зачем это нужно, как это может помочь.
                - Избегай шаблонных фраз и клише. Отвечай с искренним участием.
                - Используй эмодзи, если они действительно уместны, чтобы добавить тепла и человечности 😊

                **Если пользователь просит "план" или "пошаговое объяснение", отвечай только в Markdown:**

                ## Краткий заголовок (одно предложение)

                Короткое, поддерживающее вступление (1–2 предложения).

                1. **Шаг 1 — Короткое название.** Объяснение (1–2 предложения).
                2. **Шаг 2 — ...**
                3. **Шаг 3 — ...**

                Короткая поддержка или призыв к действию (1 предложение).

                **Формат вывода:**  
                - Никаких префиксов вроде "Психолог:", "Ответ:", и т.п.  
                - Только чистый текст или Markdown.  
                - Если человек просит "коротко" — делай ответ лаконичным, но всё равно с теплотой.

                ---

                **Последние сообщения чата:**
                ${lastFiveMessages}

                **Пользователь:** ${input}

                **Психолог:**`

                setLoading(true)

                try {
                    const res = await axiosClassic.post("claude-ai/generate", { prompt })

                    console.log(res.status, 'res.status')

                    data = await res.data;

                    const botMessage: IMessage = {
                        position: "left",
                        title: "Ассистент",
                        text: data.text,
                    };

                    setMessages((prev) => [...prev, messageToSend, botMessage]);

                    await axiosClassic.put(`/chat/${chatId}`, {
                        chatId: chatId,
                        messages: [messageToSend, botMessage]
                    })
                } catch (err) {
                    console.log(err)
                } finally {
                    setLoading(false)
                }
            } else {
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

    const openModalForExit = () => {
        psy ? setOpenModal(true) : setOpenModalLogout(true)
    }

    return (

        <div
            className={`flex flex-col h-[100dvh] mx-auto border overflow-hidden transition-colors ${theme === "light"
                ? "bg-gray-50 border-gray-300 text-gray-900"
                : "bg-gray-900 border-gray-700 text-gray-100"
                }`}
        >
            <Modal title={"Подтвердите"}
                content={"Вы уверены что хотите выйти из чата?"}
                openModal={openModal} setOpenModal={setOpenModal}
                action={handleLeaveChat} />

            <Modal title={"Подтвердите"}
                content={"Вы уверены что хотите выйти из аккаунта?"}
                openModal={openModalLogout}
                setOpenModal={setOpenModalLogout}
                action={handleLogout} />
            {/* Header */}
            <div
                className={`flex items-center justify-between p-4 border-b ${theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
                    }`}
            >
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl">
                            🤖
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    </div>
                    <div>
                        <h1 className="font-semibold text-lg">{psy ? psy.name : "Ассистент"}</h1>
                        <p className="text-sm opacity-70">
                            {psy ? "В сети • Психолог" : "В сети • Ассистент"}
                        </p>
                    </div>
                </div>

                <div className="flex gap-[30px]">
                    {/* Кнопка смены темы */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="text-xl cursor-pointer"
                    >
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>

                    {/* Кнопка выхода из аккаунта или чата */}
                    <button onClick={() => openModalForExit()}>
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>


            {/* Messages */}
            <div className="flex-1 overflow-auto p-4">
                {messages.map((msg, index) => (

                    <div
                        key={index}
                        className={`flex mb-3 ${msg.position === "right" ? "justify-end" : "justify-start"
                            }`}
                    >


                        <div
                            className={`px-4 py-2 rounded-2xl max-w-[70%] ${msg.position === "right"
                                ? "bg-blue-500 text-white rounded-br-none"
                                : theme === "light"
                                    ? "bg-gray-200 text-gray-900 rounded-bl-none"
                                    : "bg-gray-700 text-gray-100 rounded-bl-none"
                                }`}
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {loading ? <Loading /> : undefined}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
                onSubmit={handleSubmit}
                className={`border-t p-3 flex items-center gap-2 ${theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
                    }`}
            >
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Напишите сообщение..."
                    className={`flex-1 resize-none p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === "light"
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-gray-900 border-gray-700 text-gray-100"
                        }`}
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                />
                <button
                    type="submit"
                    disabled={!input.trim()}
                    className={`px-4 py-2 rounded-lg text-white ${input.trim()
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                        }`}
                >
                    ➤
                </button>
            </form>
        </div>
    );

}
