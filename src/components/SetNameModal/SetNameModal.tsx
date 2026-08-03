import { userService } from "@/app/services/users.service";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { HeartHandshake, X } from "lucide-react";

export default function SetNameModal({
    openModal,
    setOpenModal,
    userId,
}: {
    openModal: boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    userId?: string;
}) {
    const [name, setName] = useState("");
    const router = useRouter();

    if (!openModal) return null;

    const saveName = async () => {
        if (!userId || !name.trim()) return;
        await userService.updateUser(userId, { name: name.trim() });
        setOpenModal(false);
    };

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="name-title">
            <div className="relative w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-2xl sm:p-8">
                <button onClick={() => router.push("/login")} className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Закрыть"><X className="h-4 w-4" /></button>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-700"><HeartHandshake className="h-5 w-5" /></span>
                <h2 id="name-title" className="mt-5 text-2xl font-semibold text-slate-900">Как к вам обращаться?</h2>
                <p className="mt-2 leading-6 text-slate-500">Имя поможет сделать разговор немного теплее.</p>
                <input value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && saveName()} placeholder="Ваше имя" autoFocus className="field-control mt-6" />
                <div className="mt-6 flex gap-2">
                    <button onClick={() => router.push("/login")} className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Войти</button>
                    <button onClick={saveName} disabled={!name.trim()} className="primary-button flex-1 px-4 py-2.5 text-sm disabled:opacity-50">Продолжить</button>
                </div>
            </div>
        </div>
    );
}
