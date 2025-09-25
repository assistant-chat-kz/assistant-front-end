"use client";

import NotFound from "@/components/NotFound/NotFound";
import { useAdmin } from "../hooks/useAdmin";
import { useAllConsultations } from "../hooks/useAllConsultations";
import Table from "@/components/Stats/Table";
import { useAllUsers } from "../hooks/useAllUsers";
import { useAllChats } from "../hooks/useAllChats";
import { useAllUsersNoAuth } from "../hooks/useAllUsersNoAuth";

export default function Stats() {

    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") ?? undefined : undefined;

    const { data: admin, isLoading } = useAdmin(userId)
    const { data: chats } = useAllChats()

    const { data: consultations } = useAllConsultations()
    const { data: users } = useAllUsers()
    const { data: usersNoAuth } = useAllUsersNoAuth()

    return (
        <div>
            {consultations && users && usersNoAuth ? <Table users={users} usersNoAuth={usersNoAuth} consultations={consultations} /> : undefined}
        </div>
    )
}