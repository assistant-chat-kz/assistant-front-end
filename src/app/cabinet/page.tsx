"use client";

import { useUser } from "../hooks/useUser";
import { useRouter } from "next/navigation";

export default function Cabinet() {


    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") ?? undefined : undefined;

    const { data: user, isLoading, error } = useUser(userId)

    console.log(user)

    const router = useRouter();

    const toPsychologist = () => {
        router.push('/psychologists')
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">

            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <button
                    onClick={toPsychologist}
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600"
                >
                    Психологи
                </button>
            </div>

        </div>
    )
}