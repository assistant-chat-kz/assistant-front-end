import { IConsultationResponce } from "@/types/consultation.types";
import { IUserNoAuthResponce, IUserResponce } from "@/types/users.types"
import { useRouter } from "next/navigation";
import { useChat } from '../../app/hooks/useChat'

interface ITable {
    users: IUserResponce[];
    usersNoAuth: IUserNoAuthResponce[]
    consultations: IConsultationResponce[]
}


export default function Table({ users, usersNoAuth, consultations }: ITable) {

    const router = useRouter();

    const toStatsId = (id: string) => {
        router.push(`stats/${id}`)
    }

    const { data: chat } = useChat("b4TgMM8krp")


    console.log(consultations, 'consultations')




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
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                            <th onClick={() => toStatsId(user.id)} scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer">
                                {`${user.name} ${user.surname}`}
                            </th>
                            <td className="px-6 py-4">
                                {user.email}
                            </td>
                            <td className="px-6 py-4">
                                {consultations?.filter(cons => cons.userId === user.id).length}
                            </td>
                            <td className="px-6 py-4">
                                {user?.visits}
                            </td>
                        </tr>
                    ))}
                    {usersNoAuth?.map(user => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                            <th onClick={() => toStatsId(user.id)} scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer">
                                {`${user.id}`}
                            </th>
                            <td className="px-6 py-4">
                                {/* {user.email} */}
                            </td>
                            <td className="px-6 py-4">
                                {consultations?.filter(cons => cons.chatId === user.id).length}
                            </td>
                            <td className="px-6 py-4">
                                {user?.visits}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    )
}