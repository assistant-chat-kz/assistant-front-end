import { IConsultationResponce } from "@/types/consultation.types";
import { IUserNoAuthResponce, IUserResponce } from "@/types/users.types"
import { useRouter } from "next/navigation";
import { useAllChats } from "@/app/hooks/useAllChats";
import { useChat } from "@/app/hooks/useChat";

interface ITable {
    users: IUserResponce[];
    usersNoAuth: IUserNoAuthResponce[]
    consultations: IConsultationResponce[]
}


export default function Table({ users, usersNoAuth, consultations }: ITable) {

    const router = useRouter();
    const { data: chats } = useAllChats()

    const toStatsId = (id: string) => {
        router.push(`stats/${id}`)
    }

    function UserRow({ user, consultations }: { user: IUserResponce | IUserNoAuthResponce, consultations: IConsultationResponce[] }) {
        const currentChat = chats?.find(chat => chat.members.find(item => item === user.id))
        const { data: chat } = useChat(currentChat?.chatId)

        console.log(chat, 'chat')
        return (
            <tr onClick={() => toStatsId(user.id)} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer">
                    {`${user.name || user.id} ${user.surname || ""}`}
                </th>
                <td className="px-6 py-4">
                    {user.email || ""}
                </td>
                <td className="px-6 py-4">
                    {consultations?.filter(cons => cons.userId === user.id).length}
                </td>
                <td className="px-6 py-4">
                    {user?.visits}
                </td>
                <td className="px-6 py-4">
                    {chat?.messages?.length ?? 0} сообщений
                </td>
            </tr>
        )
    }



    return (
        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Имя
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Почта
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Консультации
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Посещение
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map(user => (
                        <UserRow key={user.id} user={user} consultations={consultations} />
                    ))}
                    {usersNoAuth?.map(user => (
                        <UserRow key={user.id} user={user} consultations={consultations} />
                    ))}
                </tbody>
            </table>
        </div>

    )
}