import { Bot, ExternalLink, HeartHandshake, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface AssistantChoiceProps {
    openModal: boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
}

export default function AssistantChoice({ openModal, setOpenModal }: AssistantChoiceProps) {
    const router = useRouter();

    if (!openModal) return null;

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="choice-title">
            <div className="relative w-full max-w-2xl rounded-[1.75rem] bg-white p-6 shadow-2xl sm:p-8">
                <button
                    onClick={() => setOpenModal(false)}
                    className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Закрыть"
                >
                    <X className="h-5 w-5" />
                </button>

                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">Выберите формат</p>
                <h2 id="choice-title" className="mt-2 text-2xl font-semibold text-slate-900">Какая поддержка нужна сейчас?</h2>
                <p className="mt-2 text-slate-500">Можно начать с AI-помощника или сразу записаться к специалисту.</p>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    <button
                        onClick={() => router.push("/chat")}
                        className="group rounded-2xl border border-teal-200 bg-teal-50 p-5 text-left hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg"
                    >
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-700 text-white"><Bot className="h-5 w-5" /></span>
                        <span className="mt-5 block text-lg font-semibold text-slate-900">Поговорить с Aikouch</span>
                        <span className="mt-2 block text-sm leading-6 text-slate-600">Ответит сразу и поможет сформулировать следующий шаг.</span>
                    </button>

                    <button
                        onClick={() => window.location.assign("https://www.zumcare.kz/kazakhtelecom")}
                        className="group rounded-2xl border border-slate-200 bg-white p-5 text-left hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
                    >
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f9735b] text-white"><HeartHandshake className="h-5 w-5" /></span>
                        <span className="mt-5 flex items-center gap-2 text-lg font-semibold text-slate-900">Записаться к психологу <ExternalLink className="h-4 w-4" /></span>
                        <span className="mt-2 block text-sm leading-6 text-slate-600">Перейти к выбору специалиста и удобного времени.</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
