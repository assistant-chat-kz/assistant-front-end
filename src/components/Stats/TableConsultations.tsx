import { ClipboardCheck } from "lucide-react";
import { usePsy } from "@/app/hooks/usePsy";
import { IConsultationResponce } from "@/types/consultation.types";

function ConsultationRow({ consultation }: { consultation: IConsultationResponce }) {
    const { data: psychologist } = usePsy(consultation.psyId || undefined);
    const scores = consultation.questions
        .map((question) => Number(question.answer))
        .filter((answer) => Number.isFinite(answer));
    const average = scores.length
        ? (scores.reduce((total, score) => total + score, 0) / scores.length).toFixed(1)
        : null;

    return (
        <tr className="bg-white align-top">
            <td className="px-5 py-4 font-mono text-xs text-slate-500">{consultation.chatId}</td>
            <td className="whitespace-nowrap px-5 py-4 text-slate-500">{new Date(consultation.createdAt).toLocaleString("ru-RU")}</td>
            <td className="px-5 py-4">
                <div className="space-y-2">
                    {average && <p className="mb-3 font-semibold text-amber-700">Средняя оценка: {average} / 10</p>}
                    {consultation.questions.map((question, index) => (
                        <div key={`${question.question}-${index}`} className="rounded-xl bg-slate-50 p-3">
                            <p className="text-xs text-slate-500">{question.question}</p>
                            <p className="mt-1 font-semibold text-slate-800">{question.answer}</p>
                        </div>
                    ))}
                </div>
            </td>
            <td className="px-5 py-4 text-slate-600">{psychologist ? `${psychologist.name} ${psychologist.surname}` : "Не указан"}</td>
        </tr>
    );
}

export default function TableConsultations({ consultations }: { consultations: IConsultationResponce[] }) {
    if (!consultations.length) {
        return (
            <div className="surface-card rounded-[1.5rem] p-10 text-center">
                <ClipboardCheck className="mx-auto h-9 w-9 text-teal-700" />
                <p className="mt-4 font-semibold text-slate-900">Консультаций пока нет</p>
                <p className="mt-2 text-sm text-slate-500">Результаты опросов появятся после завершённых диалогов.</p>
            </div>
        );
    }

    return (
        <div className="surface-card overflow-hidden rounded-[1.5rem]">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-[#f7faf9] text-xs uppercase tracking-[0.08em] text-slate-500"><tr><th className="px-5 py-4">Chat ID</th><th className="px-5 py-4">Дата</th><th className="px-5 py-4">Результаты</th><th className="px-5 py-4">Специалист</th></tr></thead>
                    <tbody className="divide-y divide-[#e7efec]">{consultations.map((consultation, index) => <ConsultationRow key={`${consultation.chatId}-${index}`} consultation={consultation} />)}</tbody>
                </table>
            </div>
        </div>
    );
}
