import { AlertTriangle, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface ModalProps {
    title: string;
    content: string;
    openModal: boolean;
    setOpenModal: Dispatch<SetStateAction<boolean>>;
    action: () => void;
    button?: "accept" | "cancel";
}

export default function Modal({ title, content, openModal, setOpenModal, action, button }: ModalProps) {
    if (!openModal) return null;

    const close = () => setOpenModal(false);

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="relative w-full max-w-md rounded-[1.5rem] bg-white p-6 shadow-2xl">
                <button onClick={close} className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Закрыть"><X className="h-4 w-4" /></button>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-600"><AlertTriangle className="h-5 w-5" /></span>
                <h3 id="modal-title" className="mt-5 text-xl font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 leading-6 text-slate-500">{content}</p>
                <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    {button !== "accept" && <button type="button" onClick={close} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Отмена</button>}
                    {button !== "cancel" && <button type="button" onClick={action} className="rounded-xl bg-[#123d38] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0e302c]">Подтвердить</button>}
                </div>
            </div>
        </div>
    );
}
