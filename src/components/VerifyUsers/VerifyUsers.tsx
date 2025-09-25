import { useAllUsers } from "@/app/hooks/useAllUsers"

import { userService } from "@/app/services/users.service"
import { IUserResponce } from "@/types/users.types"
import { useQueryClient } from "@tanstack/react-query"

export default function VerifyUsers() {

    const { data: users } = useAllUsers()
    const queryClient = useQueryClient();

    const noVerifyUsers = users?.filter(user => !user.verify)

    const verifyUser = async (user: IUserResponce) => {
        try {
            if (!user.verify) {
                const response = await userService.verifyUser(user.id)
                alert("Пользователь подтвержден")
                //@ts-ignore
                queryClient.invalidateQueries(["user", user.id])
            }
        } catch {
            throw new Error("Ошибка")
        }
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
                            Верификация
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {noVerifyUsers?.map(user => (
                        <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer">
                                {`${user.name} ${user.surname}`}
                            </th>
                            <td className="px-6 py-4">
                                {user.email}
                            </td>
                            <td className="px-6 py-4">
                                <button onClick={() => verifyUser(user)} className="mt-10 flex w-200 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600">
                                    Подтвердить идентификацию
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    )
}