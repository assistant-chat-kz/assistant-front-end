"use client";

import { Check, UserCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAllUsers } from "@/app/hooks/useAllUsers";
import { userService } from "@/app/services/users.service";
import { IUserResponce } from "@/types/users.types";
import SourceBadge from "../SourceBadge/SourceBadge";

export default function VerifyUsers() {
    const { data: users } = useAllUsers();
    const queryClient = useQueryClient();
    const unverifiedUsers = users?.filter((user) => !user.verify) || [];

    const verifyUser = async (user: IUserResponce) => {
        await userService.verifyUser(user.id);
        await queryClient.invalidateQueries({ queryKey: ["user"] });
    };

    if (unverifiedUsers.length === 0) {
        return (
            <div className="surface-card rounded-[1.5rem] p-10 text-center">
                <UserCheck className="mx-auto h-9 w-9 text-teal-700" />
                <p className="mt-4 font-semibold text-slate-900">Все пользователи подтверждены</p>
                <p className="mt-2 text-sm text-slate-500">Новых заявок на проверку сейчас нет.</p>
            </div>
        );
    }

    return (
        <div className="surface-card overflow-hidden rounded-[1.5rem]">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="bg-[#f7faf9] text-xs uppercase tracking-[0.08em] text-slate-500">
                        <tr><th className="px-5 py-4">Пользователь</th><th className="px-5 py-4">Источник</th><th className="px-5 py-4 text-right">Действие</th></tr>
                    </thead>
                    <tbody className="divide-y divide-[#e7efec]">
                        {unverifiedUsers.map((user) => (
                            <tr key={user.id} className="bg-white">
                                <td className="px-5 py-4"><p className="font-semibold text-slate-900">{user.name} {user.surname}</p><p className="mt-1 text-xs text-slate-400">{user.email}</p></td>
                                <td className="px-5 py-4"><SourceBadge source={user.source} compact /></td>
                                <td className="px-5 py-4 text-right"><button onClick={() => verifyUser(user)} className="inline-flex items-center gap-2 rounded-xl bg-[#123d38] px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-[#0e302c]"><Check className="h-4 w-4" /> Подтвердить</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
