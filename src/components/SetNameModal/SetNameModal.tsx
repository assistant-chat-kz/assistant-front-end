import { userService } from "@/app/services/users.service";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react"

interface IModalChoice {
    openModal: boolean
    setOpenModal: Dispatch<SetStateAction<boolean>>
    userId: string | undefined
}

export default function SetNameModal({ openModal, setOpenModal, userId }: IModalChoice) {

    const [name, setName] = useState('')

    const router = useRouter();

    const handleCloseModal = () => {
        setOpenModal(!openModal)
    }

    const updateNameForUser = async () => {
        //@ts-ignore
        await userService.updateUser(userId, { name })
    }

    return openModal ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300 scale-100">
                <button
                    onClick={() => {
                        router.push('/login');
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
                    Введите своё имя
                </h2>

                <div className="mb-6">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ваше имя..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 
                     focus:ring-2 focus:ring-blue-500 focus:outline-none 
                     bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => {
                            router.push('/login');
                        }}
                        className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 
                     dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white 
                     transition"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={() => {
                            if (name.trim()) {
                                updateNameForUser()
                                handleCloseModal();
                            }
                        }}
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 
                     text-white shadow-md transition"
                    >
                        Подтвердить
                    </button>
                </div>
            </div>
        </div>
    ) : null;

}