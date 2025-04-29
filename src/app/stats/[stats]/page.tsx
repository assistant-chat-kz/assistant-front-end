'use client';
import { useAllConsultations } from "@/app/hooks/useAllConsultations";
import { useAllUsers } from "@/app/hooks/useAllUsers";
import TableConsultations from "@/components/Stats/TableConsultations";
import { useParams } from "next/navigation";

export default function StatsId() {

    const params = useParams() as { stats: string };


    const { data: consultations } = useAllConsultations()
    const { data: users } = useAllUsers()

    const consultationFilter = consultations?.filter(cons => params.stats === cons.userId)

    return (
        //@ts-ignore
        <TableConsultations consultations={consultationFilter} />
    )
}