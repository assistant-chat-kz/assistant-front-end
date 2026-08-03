"use client";

import Link from "next/link";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useUserAnalytics } from "../hooks/useUserAnalytics";
import Table from "@/components/Stats/Table";

export default function Stats() {
    const { data, isLoading, isError } = useUserAnalytics();

    return (
        <main className="min-h-dvh px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <Link href="/cabinet" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal-800">
                    <ArrowLeft className="h-4 w-4" /> Назад в кабинет
                </Link>
                <div className="mt-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Аналитика</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Пользователи и активность</h1>
                    <p className="mt-3 max-w-2xl text-slate-500">Сообщения и повторные визиты считаются по сохранённым диалогам и уникальным 30-минутным сессиям.</p>
                </div>

                {isLoading && <div className="mt-16 flex items-center justify-center gap-2 text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin text-teal-700" /> Загружаем данные…</div>}
                {isError && <div className="mt-10 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">Не удалось загрузить аналитику.</div>}
                {data && <Table analytics={data} />}
            </div>
        </main>
    );
}
