import { IConsultationResponce } from "@/types/consultation.types"

interface ITableConsultations {
    consultations: IConsultationResponce[]
}

export default function TableConsultations({ consultations }: ITableConsultations) {

    return (
        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Id чата
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Дата консультации
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Результаты консультации
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {consultations?.map(cons => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer">
                                {cons.chatId}
                            </th>
                            <td className="px-6 py-4">
                                {new Date(cons.createdAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                                {cons.questions.map(que =>
                                    <div>{que.question}:
                                        <span className="text-red-500">{que.answer}</span></div>)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}