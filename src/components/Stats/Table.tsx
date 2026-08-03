"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ClipboardCheck, MessageSquareText, RotateCcw, Star, UsersRound } from "lucide-react";
import { AudienceSource, IUserAnalytics } from "@/types/users.types";
import SourceBadge from "../SourceBadge/SourceBadge";

const filters: { value: "ALL" | AudienceSource; label: string }[] = [
    { value: "ALL", label: "Все" },
    { value: "KAZAKHTELECOM", label: "Казахтелеком" },
    { value: "OTHER", label: "Другое" },
];

function formatDate(value: string | null) {
    if (!value) return "—";
    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

export default function Table({ analytics }: { analytics: IUserAnalytics }) {
    const [sourceFilter, setSourceFilter] = useState<"ALL" | AudienceSource>("ALL");
    const [query, setQuery] = useState("");
    const router = useRouter();

    const users = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return analytics.users.filter((user) => {
            const matchesSource = sourceFilter === "ALL" || user.source === sourceFilter;
            const matchesQuery = !normalizedQuery ||
                `${user.name} ${user.surname} ${user.email} ${user.id}`.toLowerCase().includes(normalizedQuery);
            return matchesSource && matchesQuery;
        });
    }, [analytics.users, query, sourceFilter]);

    const cards = [
        { label: "Пользователи", value: analytics.summary.users, icon: UsersRound, tone: "bg-slate-100 text-slate-700" },
        { label: "Казахтелеком", value: analytics.summary.kazakhtelecom, icon: Building2, tone: "bg-teal-50 text-teal-700" },
        { label: "Сообщения пользователей", value: analytics.summary.userMessages, icon: MessageSquareText, tone: "bg-sky-50 text-sky-700" },
        { label: "Повторные визиты", value: analytics.summary.returns, icon: RotateCcw, tone: "bg-orange-50 text-orange-700" },
        { label: "Заполненные оценки", value: analytics.summary.consultations, icon: ClipboardCheck, tone: "bg-violet-50 text-violet-700" },
        { label: "Средняя оценка", value: analytics.summary.averageRating === null ? "—" : `${analytics.summary.averageRating} / 10`, icon: Star, tone: "bg-amber-50 text-amber-700" },
    ];

    return (
        <div className="mt-8">
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map(({ label, value, icon: Icon, tone }) => (
                    <div key={label} className="surface-card rounded-2xl p-5">
                        <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></div>
                        <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-900">{typeof value === "number" ? value.toLocaleString("ru-RU") : value}</p>
                        <p className="mt-1 text-sm text-slate-500">{label}</p>
                    </div>
                ))}
            </section>

            <section className="surface-card mt-5 overflow-hidden rounded-[1.5rem]">
                <div className="flex flex-col gap-4 border-b border-[#dce7e3] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="flex flex-wrap gap-2">
                        {filters.map((filter) => (
                            <button key={filter.value} onClick={() => setSourceFilter(filter.value)} className={`rounded-full px-3.5 py-2 text-sm font-semibold ${sourceFilter === filter.value ? "bg-[#123d38] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                                {filter.label}
                            </button>
                        ))}
                    </div>
                    <label className="relative block sm:w-72">
                        {/* <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /> */}
                        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Имя, почта или ID" className="field-control py-2.5 pl-10 text-sm" />
                    </label>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[960px] text-left text-sm">
                        <thead className="bg-[#f7faf9] text-xs uppercase tracking-[0.08em] text-slate-500">
                            <tr>
                                <th className="px-5 py-4 font-semibold">Пользователь</th>
                                <th className="px-5 py-4 font-semibold">Источник</th>
                                <th className="px-5 py-4 text-right font-semibold">Сообщения</th>
                                <th className="px-5 py-4 text-right font-semibold">Оценки</th>
                                <th className="px-5 py-4 text-right font-semibold">Сессии</th>
                                <th className="px-5 py-4 text-right font-semibold">Повторные визиты</th>
                                <th className="px-5 py-4 font-semibold">Последняя активность</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e7efec]">
                            {users.map((user) => (
                                <tr key={user.id} onClick={() => router.push(`/stats/${user.id}`)} className="cursor-pointer bg-white hover:bg-teal-50/40">
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-slate-900">{user.name} {user.surname}</p>
                                        <p className="mt-1 max-w-xs truncate text-xs text-slate-400">{user.email || `Гость · ${user.id}`}</p>
                                    </td>
                                    <td className="px-5 py-4"><SourceBadge source={user.source} compact /></td>
                                    <td className="px-5 py-4 text-right"><p className="font-semibold text-slate-800">{user.userMessages} от пользователя</p><p className="mt-1 text-xs text-slate-400">{user.totalMessages} всего</p></td>
                                    <td className="px-5 py-4 text-right">
                                        {user.consultationCount > 0 ? (
                                            <><p className="font-semibold text-slate-800">{user.consultationCount}</p><p className="mt-1 text-xs text-amber-700">Средняя: {user.averageRating ?? "—"} / 10</p></>
                                        ) : <span className="text-slate-400">—</span>}
                                    </td>
                                    <td className="px-5 py-4 text-right text-slate-600">{user.sessions}</td>
                                    <td className="px-5 py-4 text-right font-semibold text-orange-700">{user.returns}</td>
                                    <td className="px-5 py-4 text-slate-500">{formatDate(user.lastSeenAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && <div className="p-10 text-center text-sm text-slate-500">По выбранным условиям пользователей нет.</div>}
                </div>
            </section>
        </div>
    );
}
