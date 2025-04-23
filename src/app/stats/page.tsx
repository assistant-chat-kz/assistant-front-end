"use client";

import NotFound from "@/components/NotFound/NotFound";
import { useAdmin } from "../hooks/useAdmin";
import { useAllConsultations } from "../hooks/useAllConsultations";
import Table from "@/components/Stats/Table";
import { useAllUsers } from "../hooks/useAllUsers";

export default function Stats() {

    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") ?? undefined : undefined;

    const { data: admin, isLoading } = useAdmin(userId)

    const { data: consultations } = useAllConsultations()
    const { data: users } = useAllUsers()




    console.log(consultations, 'consultations')

    // if (!admin && !isLoading) return NotFound()

    return (
        <div>
            {consultations && users ? <Table users={users} consultations={consultations} /> : undefined}
        </div>
    )
}