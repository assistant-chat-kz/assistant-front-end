import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react"

interface IModalChoice {
    openModal: boolean
    setOpenModal: Dispatch<SetStateAction<boolean>>
}


export default function AssistantChoice({ openModal, setOpenModal }: IModalChoice) {

    const router = useRouter();

    const handleCloseModal = () => {
        setOpenModal(!openModal)
    }

    return (
        openModal ? (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl">
                    <button
                        onClick={() => handleCloseModal()}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        &times;
                    </button>

                    <h2 className="text-2xl font-bold text-center mb-6">Выберите вариант</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div onClick={() => router.push('/chat')} className="cursor-pointer bg-blue-50 hover:bg-blue-100 p-6 rounded-xl shadow-md transition">
                            <h3 className="text-xl font-semibold text-blue-700 text-center mb-2">ИИ Психолог</h3>
                            <p className="text-center text-sm text-gray-600">
                                Проконсультироваться сейчас
                                Быстрая помощь 24/7</p>
                        </div>

                        <div onClick={() => router.push('https://www.zumcare.kz/kazakhtelecom')} className="cursor-pointer bg-green-50 hover:bg-green-100 p-6 rounded-xl shadow-md transition">
                            <h3 className="text-xl font-semibold text-green-700 text-center mb-2">Консультация Психолога</h3>
                            <p className="text-center text-sm text-gray-600">Записаться  на консультацию к психологу</p>
                        </div>
                    </div>
                </div>
            </div>
        ) : null
    );
}