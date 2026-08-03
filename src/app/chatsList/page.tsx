"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Inbox, MessageCircleHeart } from "lucide-react";
import { useAllChats } from "../hooks/useAllChats";

export default function ChatList() {
    const { data: chats } = useAllChats();
    const router = useRouter();
    const requestedChats = chats?.filter((chat) => chat.call) || [];

    return (
        <main className="min-h-dvh px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <Link href="/cabinet" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal-800"><ArrowLeft className="h-4 w-4" /> Назад в кабинет</Link>
                <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Обращения</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Чаты, где ждут психолога</h1>
                <p className="mt-3 text-slate-500">Сначала показаны обращения, в которых пользователь запросил живого специалиста.</p>

                <section className="mt-8 space-y-3">
                    {requestedChats.map((chat) => (
                        <button key={chat.chatId} onClick={() => router.push(`/chat/${chat.chatId}`)} className="surface-card group flex w-full items-center gap-4 rounded-2xl p-5 text-left hover:-translate-y-0.5 hover:border-teal-200">
                            <span className="grid h-11 w-11 place-items-center rounded-xl bg-rose-50 text-rose-600"><MessageCircleHeart className="h-5 w-5" /></span>
                            <span className="min-w-0 flex-1"><span className="block font-semibold text-slate-900">Чат {chat.chatId}</span><span className="mt-1 block text-sm text-slate-500">Участников: {chat.members.length}</span></span>
                            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:translate-x-1 group-hover:text-teal-700" />
                        </button>
                    ))}
                    {requestedChats.length === 0 && (
                        <div className="surface-card rounded-[1.5rem] p-10 text-center">
                            <Inbox className="mx-auto h-9 w-9 text-teal-700" />
                            <p className="mt-4 font-semibold text-slate-900">Новых обращений нет</p>
                            <p className="mt-2 text-sm text-slate-500">Когда пользователь позовёт психолога, чат появится здесь.</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
