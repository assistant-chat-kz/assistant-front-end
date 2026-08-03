"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Bot,
    Headphones,
    HeartHandshake,
    LogOut,
    MessageCircleHeart,
    Mic,
    Send,
    ShieldCheck,
    Square,
    UserRound,
    X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useQueryClient } from "@tanstack/react-query";
import { axiosClassic } from "@/api/interceptors";
import { useChat } from "@/app/hooks/useChat";
import { useSocket } from "@/app/hooks/useSocket";
import { usePsy } from "@/app/hooks/usePsy";
import { useUser } from "@/app/hooks/useUser";
import { useCallPsy } from "@/app/hooks/useCallPsy";
import { usePsyInChat } from "@/app/hooks/usePsyInChat";
import { userService } from "@/app/services/users.service";
import { emotionService } from "@/app/services/emotion.service";
import { getVisitSessionId } from "@/lib/visit-session";
import { IUserNoAuthResponce, IUserResponce } from "@/types/users.types";
import { IPsyResponce } from "@/types/psy.types";
import Loading from "../Loading/Loading";
import Modal from "../Modal/Modal";
import SourceBadge, { sourceLabels } from "../SourceBadge/SourceBadge";
import SurveyComponent from "../Survey/SurveyComponent";

interface IMessage {
    id?: number;
    chatId?: string;
    position: "left" | "right";
    title: string;
    text: string;
    createdAt?: string;
}

type ChatUser = IUserResponce | IUserNoAuthResponce;

export default function ChatComponent({
    chatId,
    user,
    messagesInChat,
}: {
    chatId?: string;
    user?: ChatUser;
    messagesInChat?: IMessage[];
}) {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [input, setInput] = useState("");
    const [members, setMembers] = useState<string[]>([]);
    const [openLeaveModal, setOpenLeaveModal] = useState(false);
    const [openLogoutModal, setOpenLogoutModal] = useState(false);
    const [showSurvey, setShowSurvey] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isVoiceLoading, setIsVoiceLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [humanRequested, setHumanRequested] = useState(false);
    const [showSourceBanner, setShowSourceBanner] = useState(false);
    const [currentUser, setCurrentUser] = useState<ChatUser | IPsyResponce>();

    const router = useRouter();
    const queryClient = useQueryClient();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") ?? undefined : undefined;
    const { data: psy, isLoading: isPsychologistLoading } = usePsy(userId);
    const { data: chat } = useChat(chatId);
    const clientId = chat?.members.find(
        (memberId) => memberId !== "Assistant" && memberId !== chat.psy,
    );
    const { data: chatClient } = useUser(clientId);
    const { data: assignedPsychologist } = usePsy(chat?.psy || undefined);
    const { callPsychologist } = useCallPsy();
    const { psyInChat } = usePsyInChat();
    const socket = useSocket(userId);

    const source = user?.source ||
        (typeof window !== "undefined" && localStorage.getItem("userSource") === "KAZAKHTELECOM"
            ? "KAZAKHTELECOM"
            : "OTHER");
    const displayName = psy?.name || user?.name || "Вы";
    const chatTitle = psy
        ? chatClient?.name || "Пользователь"
        : assignedPsychologist
            ? `${assignedPsychologist.name} ${assignedPsychologist.surname}`.trim()
            : "Aikouch";
    const chatStatus = psy
        ? "Рабочий диалог с пользователем"
        : assignedPsychologist
            ? "Диалог с живым психологом"
            : "AI-помощник на GigaChat";

    useEffect(() => {
        if (user?.source) localStorage.setItem("userSource", user.source);
    }, [user?.source]);

    useEffect(() => {
        if (!userId || isPsychologistLoading || psy) return;
        userService.visitUser(userId, getVisitSessionId()).catch((error) =>
            console.error("Error recording visit:", error),
        );
    }, [userId, isPsychologistLoading, psy]);

    useEffect(() => {
        if (sessionStorage.getItem("showSourceBanner") !== "true") return;
        sessionStorage.removeItem("showSourceBanner");
        setShowSourceBanner(true);
        const timeout = window.setTimeout(() => setShowSourceBanner(false), 5500);
        return () => window.clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (psy) {
            setShowSurvey(false);
            return;
        }
        setShowSurvey(Boolean(chat?.surveyRequestedAt && !chat?.surveyCompletedAt));
    }, [psy, chat?.surveyRequestedAt, chat?.surveyCompletedAt]);

    useEffect(() => {
        setCurrentUser(user || psy);
        setMembers(chat?.members || []);
        if (messagesInChat) {
            setMessages(
                psy
                    ? messagesInChat.map((message) => ({
                        ...message,
                        position: message.position === "left" ? "right" : "left",
                    }))
                    : messagesInChat,
            );
        }

        if (psy && chatId) callPsychologist(chatId, false);
    }, [messagesInChat, psy, user, chat?.members, chatId]);

    useEffect(() => {
        if (!socket || !chatId) return;

        socket.emit("joinChat", chatId);
        socket.on("newMessage", (newMessage: IMessage) => {
            const isOwnMessage = newMessage.title === currentUser?.name || newMessage.title === displayName;
            if (isOwnMessage) return;
            setMessages((previous) => [
                ...previous,
                { ...newMessage, position: "left" },
            ]);
        });
        socket.on("userJoined", ({ members: nextMembers }) => {
            if (psy) psyInChat(chatId, psy.id);
            setMembers(nextMembers);
            void queryClient.invalidateQueries({ queryKey: ["chatId", chatId] });
        });
        socket.on("userLeave", ({ members: nextMembers }) => {
            setMembers(nextMembers);
            void queryClient.invalidateQueries({ queryKey: ["chatId", chatId] });
        });
        socket.on("send-survey", () => {
            if (!psy) {
                setShowSurvey(true);
                void queryClient.invalidateQueries({ queryKey: ["chatId", chatId] });
            }
        });

        return () => {
            socket.off("newMessage");
            socket.off("userJoined");
            socket.off("userLeave");
            socket.off("send-survey");
        };
    }, [socket, chatId, currentUser?.name, displayName, psy]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sortedMessages = useMemo(
        () => [...messages].sort((first, second) => (first.id ?? Number.MAX_SAFE_INTEGER) - (second.id ?? Number.MAX_SAFE_INTEGER)),
        [messages],
    );

    const handleLeaveChat = () => {
        socket?.emit("leaveChat", chatId);
        router.push("/chatsList");
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userSource");
        router.push("/login");
    };

    const requestHuman = async () => {
        if (!chatId) return;
        await callPsychologist(chatId, true);
        setHumanRequested(true);
    };

    async function fetchStreamResponse(
        prompt: string,
        userText: string,
        onChunk: (text: string) => void,
    ) {
        let emotion: string | undefined;
        try {
            const emotionResult = await emotionService.emotionPost(userText);
            emotion = emotionResult.data.emotion;
        } catch {
            // Emotion detection enriches the prompt but must not block support.
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/gigachat/stream`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, emotion }),
        });

        if (!response.ok || !response.body) throw new Error("GigaChat is unavailable");

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let done = false;
        while (!done) {
            const chunk = await reader.read();
            done = chunk.done;
            if (chunk.value) onChunk(decoder.decode(chunk.value, { stream: !done }));
        }
    }

    const handleSubmit = async (text: string) => {
        const cleanText = text.trim();
        if (!cleanText || loading) return;

        const messageToSend: IMessage = {
            position: psy ? "left" : "right",
            title: displayName,
            text: cleanText,
        };
        setInput("");
        setMessages((previous) => [
            ...previous,
            { ...messageToSend, position: "right" },
        ]);

        const activeMembers = members.length > 0 ? members : chat?.members || [];
        const visitorId = user?.id || userId;
        const humanPsychologistIsPresent =
            Boolean(chat?.psy) ||
            activeMembers.some(
                (memberId) => memberId !== "Assistant" && memberId !== visitorId,
            );
        const assistantIsActive =
            !psy &&
            !humanPsychologistIsPresent &&
            activeMembers.includes("Assistant");

        try {
            if (assistantIsActive) {
                const conversation = messages
                    .map((message) => `${message.title === "Assistant" ? "Помощник" : "Пользователь"}: ${message.text}`)
                    .join("\n");
                const prompt = `
Ты — профессиональный психологический помощник.

Помоги пользователю практичными и реалистичными советами. Если он просит план или конкретные шаги — сразу дай рекомендации без лишних уточнений. В остальных случаях можно задать один бережный вопрос. Не повторяй уже заданные вопросы. Пиши тепло, спокойно, коротко и по делу. Не ставь диагнозы.

Контекст диалога:
${conversation}

Сообщение пользователя:
${cleanText}

Ответ:
`;

                setLoading(true);
                let partialText = "";
                await fetchStreamResponse(prompt, cleanText, (chunk) => {
                    partialText += chunk;
                    setMessages((previous) => {
                        const lastMessage = previous[previous.length - 1];
                        if (lastMessage?.title === "Assistant") {
                            const updated = [...previous];
                            updated[updated.length - 1] = { ...lastMessage, text: partialText };
                            return updated;
                        }
                        return [...previous, { position: "left", title: "Assistant", text: partialText }];
                    });
                });

                await axiosClassic.put(`/chat/${chatId}`, {
                    chatId,
                    messages: [
                        messageToSend,
                        { position: "left", title: "Assistant", text: partialText },
                    ],
                });
            } else {
                socket?.emit("sendMessage", { chatId, message: messageToSend });
                await axiosClassic.put(`/chat/${chatId}`, { chatId, messages: [messageToSend] });
            }
        } catch (error) {
            console.error("Error fetching response:", error);
            setMessages((previous) => [
                ...previous,
                {
                    position: "left",
                    title: "Assistant",
                    text: "Сейчас не получается получить ответ. Попробуйте отправить сообщение ещё раз через минуту.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    async function sendAudioToServer(audioBlob: Blob) {
        try {
            setIsVoiceLoading(true);
            const formData = new FormData();
            formData.append("file", audioBlob, "voice.webm");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/speech/recognize`, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (data.text?.trim()) await handleSubmit(data.text);
        } catch (error) {
            console.error("Voice recognition error", error);
        } finally {
            setIsVoiceLoading(false);
        }
    }

    async function startRecording() {
        if (isRecording) {
            setIsRecording(false);
            mediaRecorderRef.current?.stop();
            return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];
        mediaRecorderRef.current = recorder;
        recorder.ondataavailable = (event) => chunks.push(event.data);
        recorder.onstop = async () => {
            stream.getTracks().forEach((track) => track.stop());
            await sendAudioToServer(new Blob(chunks, { type: "audio/webm" }));
        };
        recorder.start();
        setIsRecording(true);
    }

    return (
        <main className="min-h-dvh bg-[#f3f7f6] text-slate-900 lg:grid lg:grid-cols-[18rem_1fr]">
            {showSourceBanner && (
                <div className="fixed left-1/2 top-4 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-2xl border border-teal-200 bg-white p-4 shadow-xl">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900">Источник определён</p>
                        <p className="mt-0.5 text-sm text-slate-500">Категория: {sourceLabels[source]}</p>
                    </div>
                    <button onClick={() => setShowSourceBanner(false)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100" aria-label="Закрыть плашку"><X className="h-4 w-4" /></button>
                </div>
            )}

            <Modal title="Покинуть чат?" content="Вы сможете вернуться к другим обращениям из списка чатов." openModal={openLeaveModal} setOpenModal={setOpenLeaveModal} action={handleLeaveChat} />
            <Modal title="Выйти из аккаунта?" content="История останется сохранённой, но для продолжения нужно будет войти снова." openModal={openLogoutModal} setOpenModal={setOpenLogoutModal} action={handleLogout} />

            <aside className="hidden border-r border-[#dce7e3] bg-[#123d38] px-5 py-6 text-white lg:flex lg:flex-col">
                <div className="flex items-center gap-3 px-2">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/12"><HeartHandshake className="h-6 w-6" /></span>
                    <div><p className="font-semibold">Aikouch</p><p className="text-xs text-white/55">поддержка рядом</p></div>
                </div>

                <div className="mt-10 rounded-2xl bg-white/8 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">Ваш профиль</p>
                    <p className="mt-3 truncate font-medium">{displayName}</p>
                    {!psy && <div className="mt-3"><SourceBadge source={source} compact /></div>}
                </div>

                {!psy ? (
                    <div className="mt-5 rounded-2xl border border-white/10 p-4">
                        <Headphones className="h-5 w-5 text-[#f9a28f]" />
                        <p className="mt-3 font-medium">Нужен живой специалист?</p>
                        <p className="mt-2 text-sm leading-5 text-white/60">Отправьте запрос психологу прямо из этого диалога.</p>
                        <button onClick={requestHuman} disabled={humanRequested} className="mt-4 w-full rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-[#123d38] hover:bg-teal-50 disabled:opacity-60">
                            {humanRequested ? "Запрос отправлен" : "Позвать психолога"}
                        </button>
                    </div>
                ) : (
                    <div className="mt-5 rounded-2xl border border-white/10 p-4">
                        <MessageCircleHeart className="h-5 w-5 text-[#f9a28f]" />
                        <p className="mt-3 font-medium">Диалог с пользователем</p>
                        <p className="mt-2 text-sm leading-5 text-white/60">Вы подключены как живой психолог. AI-помощник в этом чате отключён.</p>
                        {chatClient?.source && (
                            <div className="mt-4">
                                <p className="mb-2 text-xs text-white/50">Источник пользователя</p>
                                <SourceBadge source={chatClient.source} compact />
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-auto rounded-2xl bg-black/10 p-4 text-xs leading-5 text-white/55">
                    Aikouch не заменяет экстренную помощь. Если вы в опасности, обратитесь в службу 112 или к человеку рядом.
                </div>
            </aside>

            <section className="flex h-dvh min-w-0 flex-col">
                <header className="flex min-h-20 items-center justify-between border-b border-[#dce7e3] bg-white/90 px-4 backdrop-blur sm:px-7">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal-50 text-teal-700">
                            {psy ? <UserRound className="h-5 w-5" /> : assignedPsychologist ? <MessageCircleHeart className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                        </span>
                        <div className="min-w-0">
                            <h1 className="truncate font-semibold">{chatTitle}</h1>
                            <p className="flex items-center gap-1.5 text-xs text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-500" /> {chatStatus}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {!psy && <div className="hidden sm:block"><SourceBadge source={source} compact /></div>}
                        <button onClick={() => psy ? setOpenLeaveModal(true) : setOpenLogoutModal(true)} className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800" aria-label="Выйти"><LogOut className="h-4 w-4" /></button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-7">
                    <div className="mx-auto max-w-3xl space-y-5">
                        {showSurvey && !psy && (
                            <div className="rounded-2xl border border-teal-200 bg-white p-5 shadow-sm">
                                <SurveyComponent chatId={chatId} user={user && "email" in user ? user : userId || ""} psyId={chat?.consultationPsychologistId || undefined} />
                            </div>
                        )}
                        {sortedMessages.map((message, index) => {
                            const own = message.position === "right";
                            return (
                                <div key={message.id ?? `${message.title}-${index}`} className={`flex items-end gap-2.5 ${own ? "justify-end" : "justify-start"}`}>
                                    {!own && <span className="mb-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-teal-700 text-white"><MessageCircleHeart className="h-4 w-4" /></span>}
                                    <div className={`max-w-[86%] rounded-2xl px-4 py-3 text-[15px] leading-6 shadow-sm sm:max-w-[72%] ${own ? "rounded-br-md bg-[#123d38] text-white" : "rounded-bl-md border border-[#dce7e3] bg-white text-slate-700"}`}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                                    </div>
                                </div>
                            );
                        })}
                        {loading && <Loading />}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="border-t border-[#dce7e3] bg-white px-4 py-3 sm:px-7 sm:py-4">
                    <form onSubmit={(event) => { event.preventDefault(); handleSubmit(input); }} className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-[#d5e2de] bg-[#f8fbfa] p-2 shadow-sm focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-100">
                        <textarea
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            placeholder="Напишите, что сейчас происходит…"
                            className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] outline-none placeholder:text-slate-400"
                            rows={1}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" && !event.shiftKey) {
                                    event.preventDefault();
                                    handleSubmit(input);
                                }
                            }}
                        />
                        <button type="button" onClick={startRecording} disabled={isVoiceLoading} className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${isRecording ? "bg-rose-100 text-rose-700" : "text-slate-500 hover:bg-slate-100"}`} aria-label={isRecording ? "Остановить запись" : "Записать голос"}>
                            {isRecording ? <Square className="h-4 w-4 fill-current" /> : <Mic className="h-5 w-5" />}
                        </button>
                        <button type="submit" disabled={!input.trim() || loading} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-700 text-white shadow-sm hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300" aria-label="Отправить"><Send className="h-4 w-4" /></button>
                    </form>
                    <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-slate-400 sm:text-xs">Ответы носят информационный характер и не заменяют медицинскую помощь.</p>
                </div>
            </section>
        </main>
    );
}
