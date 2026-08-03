"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import VerifyUsers from "@/components/VerifyUsers/VerifyUsers";

export default function UsersPage() {
    return (
        <main className="min-h-dvh px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <Link href="/cabinet" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal-800"><ArrowLeft className="h-4 w-4" /> Назад в кабинет</Link>
                <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Доступ</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Проверка пользователей</h1>
                <p className="mb-8 mt-3 text-slate-500">Подтвердите аккаунты, которые ожидают доступа к сервису.</p>
                <VerifyUsers />
            </div>
        </main>
    );
}
