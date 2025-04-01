"use client";

import { useAdmin } from "../hooks/useAdmin";
import { usePsy } from "../hooks/usePsy";
import { useRouter } from "next/navigation";

export default function Cabinet() {

    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") ?? undefined : undefined;

    const { data: psy } = usePsy(userId)

    console.log(psy)

    const router = useRouter();

    const toPsychologist = () => {
        router.push('/psychologists')
    }

    const toChats = () => {
        router.push('/chatsList')
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">

            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                {psy ? <div></div> : <button
                    onClick={toPsychologist}
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600"
                >
                    Психологи
                </button>}
                <button
                    onClick={toChats}
                    className="mt-10 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600"
                >
                    Чаты
                </button>
            </div>

        </div>
    )
}