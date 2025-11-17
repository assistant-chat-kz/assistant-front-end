'use client'
import { useEffect, useRef, useState } from "react";
import { MessageBox } from "react-chat-elements";
import { useUser } from "@/app/hooks/useUser";
import { usePsy } from "@/app/hooks/usePsy";
import { useRouter, useSearchParams } from "next/navigation";
import "react-chat-elements/dist/main.css";
import { axiosClassic } from "@/api/interceptors";
import { useChat } from "@/app/hooks/useChat";
import { useSocket } from "../../app/hooks/useSocket";
import { useCallPsy } from "@/app/hooks/useCallPsy";
import { useConsultation } from "@/app/hooks/useConsultation";
import { usePsyInChat } from "@/app/hooks/usePsyInChat";
import Modal from "@/components/Modal/Modal";
import SurveyComponent from "../Survey/SurveyComponent";
import { IUserResponce } from "@/types/users.types";
import { IPsyResponce } from "@/types/psy.types";
import { userService } from "@/app/services/users.service";
import { LogOut } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Loading from "../Loading/Loading";
import { emotionService } from "@/app/services/emotion.service";

interface IMessage {
    position: "left" | "right";
    title: string;
    text: string;
}

export default function ChatComponent({
    chatId,
    user,
    messagesInChat,
}: {
    chatId?: string;
    user?: IUserResponce;
    messagesInChat?: any[];
}) {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [input, setInput] = useState("");
    const [members, setMembers] = useState<any>([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalLogout, setOpenModalLogout] = useState(false);
    const [showCallPsyButton, setShowCallPsyButton] = useState(false);
    const [currentUser, setCurrentUser] = useState<IUserResponce | IPsyResponce>();
    const [showSurvey, setShowSurvey] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const userId =
        typeof window !== "undefined"
            ? localStorage.getItem("userId") ?? undefined
            : undefined;

    const { data: psy } = usePsy(userId);
    const { data: chat } = useChat(chatId);
    const { data: consultation } = useConsultation(chatId, userId);
    const { callPsychologist } = useCallPsy();
    const { psyInChat } = usePsyInChat();
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
            console.error("Error visiting user:", e);
        }
    };

    useEffect(() => {
        visitUser();
    }, [userId]);

    const noAuthUserName = user?.name ? user.name : "You";

    const userMessage: IMessage = {
        position: psy ? "left" : "right",
        title: psy ? psy.name : noAuthUserName,
        text: input,
    };

    //@ts-ignore
    const socket = useSocket(userId);

    useEffect(() => {
        setCurrentUser(user ? user : psy);
        updateMessagesInChat();

        if (psy && chatId) {
            callPsychologist(chatId, false);
        }
    }, [messagesInChat, psy, chatId, socket]);

    useEffect(() => {
        if (!socket || !chatId) return;

        socket.emit("joinChat", chatId);

        socket.on("newMessage", (newMessage: IMessage) => {
            const reverseMessage =
                currentUser?.name !== newMessage.title && noAuthUserName !== "You"
                    ? { ...newMessage, position: "left" }
                    : { ...newMessage, position: "right" };
            //@ts-ignore
            setMessages((prev) => [...prev, reverseMessage]);
        });

        socket.on("userJoined", ({ members: newMembers }) => {
            if (psy) psyInChat(chatId, psy.id);

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
            setMessages(messagesInChat);

            if (psy && messagesInChat.length > 0) {
                setMessages((messages) =>
                    messages.map((msg) => ({
                        ...msg,
                        position: msg.position === "left" ? "right" : "left",
                    }))
                );
            }
        }
    };

    const handleLeaveChat = () => {
        socket?.emit("leaveChat", chatId);
        router.push("/chatsList");
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        router.push("/login");
    };

    //@ts-ignore


    const openModalForExit = () => {
        psy ? setOpenModal(true) : setOpenModalLogout(true);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function fetchStreamResponse(prompt: string, onChunk: (text: string) => void) {

        const emotionResult = await emotionService.emotionPost(input)

        const emotion = emotionResult.data.emotion

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/claude-ai/stream`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, emotion }),
        });

        if (!response.body) throw new Error("No stream body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        let done = false;
        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            onChunk(chunkValue);
        }

    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!input.trim()) return;

        const messageToSend = { ...userMessage, text: input };
        setInput("");
        setMessages((prev) => [...prev, messageToSend]);

        try {
            if (
                chat?.members.length === 1 ||
                (chat?.members.length !== 3 &&
                    members.length !== 3 &&
                    chat?.members.includes("Assistant"))
            ) {
                const lastFiveMessages =
                    chat?.messages
                        ?.slice(-10)
                        .map((message: any) => {
                            const role =
                                message.author === "Assistant" ? "Psychologist" : "User";
                            return `${role}: ${message.text}`;
                        })
                        .join("\n") || "";

                const prompt = `You are a professional psychologist assistant engaging in a warm, human, and deep conversation.  
Your goal is to help a person understand themselves, their feelings, and find balance.

**Conversation flow:**
- Ask only **one thoughtful question at a time**, not multiple.
- Wait for the user's reply before asking the next question.
- Keep continuity: refer to what the user said before.
- Never overload the user with too many questions or ideas in one message.
- Keep the conversation natural and emotionally intelligent.

**Style of communication:**
- Write naturally, as in a real conversation. Don’t start with greetings like “Hi” or “Hello” — just continue the dialogue.
- Tone — warm, empathetic, but not overly sweet.
- Show emotional understanding (“It seems you’re feeling anxious...”), and explain why someone might feel that way.
- Explain the meaning of your advice: why it matters and how it helps.
- Avoid clichés and generic responses. Write sincerely.
- Use emojis if they truly fit 😊

**If the user asks for a “plan” or “step-by-step explanation”, respond only in Markdown format:**

## Short title (one sentence)

Short supportive intro (1–2 sentences).

1. **Step 1 — Title.** Explanation (1–2 sentences).
2. **Step 2 — ...**
3. **Step 3 — ...**

Short encouragement or supportive closing sentence.

**Format:**
- No prefixes like “Psychologist:” or “Answer:” .
- Only clean text or Markdown.
- If the user asks for “short”, keep it concise but warm.

---

**Last messages in chat:**
${lastFiveMessages}

**User:** ${input}

**Psychologist:**`;


                setLoading(true);

                let partialText = "";

                await fetchStreamResponse(prompt, (chunk) => {
                    partialText += chunk;

                    setMessages((prev) => {
                        const lastMsg = prev[prev.length - 1];
                        if (lastMsg?.title === "Assistant") {
                            const updated = [...prev];
                            updated[updated.length - 1] = {
                                ...lastMsg,
                                text: partialText,
                            };
                            return updated;
                        } else {
                            return [
                                ...prev,
                                { position: "left", title: "Assistant", text: partialText },
                            ];
                        }
                    });
                });

                setLoading(false);

                await axiosClassic.put(`/chat/${chatId}`, {
                    chatId: chatId,
                    messages: [
                        messageToSend,
                        { position: "left", title: "Assistant", text: partialText },
                    ],
                });

            } else {
                socket?.emit("sendMessage", { chatId, message: messageToSend });
                await axiosClassic.put(`/chat/${chatId}`, {
                    chatId: chatId,
                    messages: [messageToSend],
                });
            }
        } catch (error) {
            console.error("Error fetching response:", error);
            setLoading(false);
        }
    };

    return (
        <div
            className={`flex flex-col h-[100dvh] mx-auto border overflow-hidden transition-colors ${theme === "light"
                ? "bg-gray-50 border-gray-300 text-gray-900"
                : "bg-gray-900 border-gray-700 text-gray-100"
                }`}
        >
            <Modal
                title={"Confirm"}
                content={"Are you sure you want to leave the chat?"}
                openModal={openModal}
                setOpenModal={setOpenModal}
                action={handleLeaveChat}
            />

            <Modal
                title={"Confirm"}
                content={"Are you sure you want to log out?"}
                openModal={openModalLogout}
                setOpenModal={setOpenModalLogout}
                action={handleLogout}
            />

            {/* Header */}
            <div
                className={`flex items-center justify-between p-4 border-b ${theme === "light"
                    ? "bg-white border-gray-200"
                    : "bg-gray-800 border-gray-700"
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
                        <h1 className="font-semibold text-lg">
                            {psy ? psy.name : "Assistant"}
                        </h1>
                        <p className="text-sm opacity-70">
                            {psy ? "Online • Psychologist" : "Online • Assistant"}
                        </p>
                    </div>
                </div>

                <div className="flex gap-[30px]">
                    {/* Theme toggle button */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="text-xl cursor-pointer"
                    >
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>

                    {/* Logout/leave button */}
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
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.text}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
                {loading ? <Loading /> : undefined}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
                onSubmit={handleSubmit}
                className={`border-t p-3 flex items-center gap-2 ${theme === "light"
                    ? "bg-white border-gray-200"
                    : "bg-gray-800 border-gray-700"
                    }`}
            >
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
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
