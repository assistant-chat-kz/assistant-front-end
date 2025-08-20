'use client';

import NotFound from "@/components/NotFound/NotFound";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUserId } from "../hooks/getUserId";
import { useAdmin } from "../hooks/useAdmin";
import { useUser } from "../hooks/useUser";

export default function Psychologists() {

    const { data: admin, isLoading } = useAdmin(getUserId())

    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (!admin) {
                return NotFound()
            }
        }
    }, [admin])

    const toPsychologist = () => {
        router.push('psychologists/create')
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">

            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <button
                    onClick={toPsychologist}
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600"
                >
                    Создать психолога
                </button>
            </div>

        </div>
    )
}