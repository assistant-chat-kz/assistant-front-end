import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { axiosClassic } from "@/api/interceptors";
import { IUserResponce } from "@/types/users.types";

const questions = [
    "Насколько полезным был этот разговор?",
    "Насколько лучше вы чувствуете себя сейчас?",
    "Хотели бы вы обратиться к помощнику снова?",
    "Насколько практичными были рекомендации?",
    "Чувствуете ли вы эмоциональную поддержку?",
];

export default function SurveyComponent({
    chatId,
    user,
    psyId,
}: {
    chatId?: string;
    user: IUserResponce | string;
    psyId?: string;
}) {
    const queryClient = useQueryClient();
    const [completed, setCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [answers, setAnswers] = useState<Record<string, number | null>>(
        Object.fromEntries(questions.map((question) => [question, null])),
    );

    const sendSurvey = async () => {
        if (isSubmitting || !Object.values(answers).every((value) => value !== null)) return;
        setIsSubmitting(true);
        setErrorMessage("");
        try {
            const endpoint = typeof user === "string" ? "/consultation/createConsultationNoAuth" : "/consultation";
            await axiosClassic.post(endpoint, { chatId, user, answers, psyId });
            setCompleted(true);
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["chatId", chatId] }),
                queryClient.invalidateQueries({ queryKey: ["user-analytics"] }),
                queryClient.invalidateQueries({ queryKey: ["consultation"] }),
            ]);
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || "Не удалось сохранить оценку.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (completed) {
        return <div className="flex items-center gap-3 text-teal-800"><CheckCircle2 className="h-5 w-5" /><p className="font-semibold">Спасибо, ответы сохранены.</p></div>;
    }

    return (
        <div>
            <p className="font-semibold text-slate-900">Как прошёл разговор?</p>
            <p className="mt-1 text-sm text-slate-500">Оцените каждый пункт от 1 до 10.</p>
            <div className="mt-5 space-y-5">
                {questions.map((question) => (
                    <fieldset key={question}>
                        <legend className="text-sm font-medium text-slate-700">{question}</legend>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
                                <label key={value} className={`grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-xs font-semibold ${answers[question] === value ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                                    <input type="radio" className="sr-only" name={question} checked={answers[question] === value} onChange={() => setAnswers((previous) => ({ ...previous, [question]: value }))} />
                                    {value}
                                </label>
                            ))}
                        </div>
                    </fieldset>
                ))}
            </div>
            {errorMessage && <p className="mt-4 text-sm text-rose-600">{errorMessage}</p>}
            <button onClick={sendSurvey} disabled={isSubmitting || !Object.values(answers).every((value) => value !== null)} className="primary-button mt-6 px-4 py-2.5 text-sm disabled:opacity-50">{isSubmitting ? "Сохраняем…" : "Сохранить оценку"}</button>
        </div>
    );
}
