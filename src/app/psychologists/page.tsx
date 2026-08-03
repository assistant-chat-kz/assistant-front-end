"use client";

import Link from "next/link";
import { ArrowLeft, Plus, UserRoundPlus } from "lucide-react";

export default function Psychologists() {
    return (
        <main className="min-h-dvh px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <Link href="/cabinet" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal-800"><ArrowLeft className="h-4 w-4" /> Назад в кабинет</Link>
                <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Команда</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Психологи</h1>
                <p className="mt-3 text-slate-500">Создавайте рабочие аккаунты специалистов, которые подключаются к обращениям.</p>

                <Link href="/psychologists/create" className="surface-card group mt-8 flex items-center gap-4 rounded-2xl p-5 hover:-translate-y-0.5 hover:border-teal-200">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-teal-700"><UserRoundPlus className="h-5 w-5" /></span>
                    <span className="min-w-0 flex-1"><span className="block font-semibold text-slate-900">Добавить психолога</span><span className="mt-1 block text-sm text-slate-500">Создать новый аккаунт специалиста</span></span>
                    <Plus className="h-5 w-5 text-slate-300 group-hover:text-teal-700" />
                </Link>
            </div>
        </main>
    );
}
