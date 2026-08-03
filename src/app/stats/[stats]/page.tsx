"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAllConsultations } from "@/app/hooks/useAllConsultations";
import TableConsultations from "@/components/Stats/TableConsultations";

export default function StatsId() {
    const params = useParams() as { stats: string };
    const { data: consultations } = useAllConsultations();
    const filtered = consultations?.filter(
        (consultation) => params.stats === consultation.userId || params.stats === consultation.userNoAuthId,
    ) || [];

    return (
        <main className="min-h-dvh px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <Link href="/stats" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal-800"><ArrowLeft className="h-4 w-4" /> Назад к аналитике</Link>
                <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">История</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Консультации пользователя</h1>
                <p className="mb-8 mt-3 text-sm text-slate-500">ID: {params.stats}</p>
                <TableConsultations consultations={filtered} />
            </div>
        </main>
    );
}
