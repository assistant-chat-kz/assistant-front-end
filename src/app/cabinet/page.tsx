"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, ChevronRight, HeartHandshake, LogOut, MessageCircle, UserRoundCog, UsersRound } from "lucide-react";
import { usePsy } from "../hooks/usePsy";

export default function Cabinet() {
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") ?? undefined : undefined;
    const { data: psychologist } = usePsy(userId);
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        router.push("/login");
    };

    const sections = [
        ...(!psychologist ? [{ href: "/psychologists", title: "Психологи", description: "Добавление и управление специалистами", icon: UserRoundCog, tone: "bg-teal-50 text-teal-700" }] : []),
        { href: "/chatsList", title: "Активные чаты", description: "Обращения, где нужен живой специалист", icon: MessageCircle, tone: "bg-sky-50 text-sky-700" },
        { href: "/stats", title: "Аналитика", description: "Источники, сообщения и повторные визиты", icon: BarChart3, tone: "bg-orange-50 text-orange-700" },
        { href: "/users", title: "Пользователи", description: "Профили и статусы доступа", icon: UsersRound, tone: "bg-violet-50 text-violet-700" },
    ];

    return (
        <main className="min-h-dvh px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="flex items-center justify-between">
                    <Link href="/cabinet" className="flex items-center gap-3 font-semibold text-[#123d38]">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#123d38] text-white"><HeartHandshake className="h-6 w-6" /></span>
                        Aikouch
                    </Link>
                    <button onClick={logout} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-900"><LogOut className="h-4 w-4" /> Выйти</button>
                </header>

                <section className="mt-16 max-w-2xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Рабочий кабинет</p>
                    <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">Всё важное — на одном экране</h1>
                    <p className="mt-4 text-lg leading-7 text-slate-500">Выберите раздел. Самые срочные обращения всегда доступны в списке чатов.</p>
                </section>

                <section className="mt-10 grid gap-4 sm:grid-cols-2">
                    {sections.map(({ href, title, description, icon: Icon, tone }) => (
                        <Link key={href} href={href} className="surface-card group flex items-center gap-4 rounded-2xl p-5 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-xl">
                            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tone}`}><Icon className="h-5 w-5" /></span>
                            <span className="min-w-0 flex-1">
                                <span className="block font-semibold text-slate-900">{title}</span>
                                <span className="mt-1 block text-sm text-slate-500">{description}</span>
                            </span>
                            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:translate-x-1 group-hover:text-teal-700" />
                        </Link>
                    ))}
                </section>
            </div>
        </main>
    );
}
