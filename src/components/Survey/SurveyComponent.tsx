import { axiosClassic } from "@/api/interceptors";
import { IQuestionResponce } from "@/types/consultation.types";
import { IUserResponce } from "@/types/users.types";
import { useState } from "react"

interface ISurveyComponent {
    chatId: string | undefined;
    user: IUserResponce | undefined;
    // questions: IQuestionResponce[]
}

export default function SurveyComponent({ chatId, user }: ISurveyComponent) {

    console.log(chatId, user, 'chat aqnd user')

    // const [answers, setAnswers] = useState({
    //     question1: null,
    //     question2: null,
    //     question3: null,
    //     question4: null,
    //     question5: null
    // })

    // const questionsArray = [
    //     '1.Насколько вы довольны этой консультацией?',
    //     '2.Как вы себя чувствуете после сессии по сравнению с тем, как чувствовали себя до неё?',
    //     '3.Хотели бы вы продолжить работу с чат-ботом в будущем?',
    //     '4.Насколько чат-бот был полезен в решении вашей проблемы?',
    //     '5.Чувствуете ли вы эмоциональную поддержку после этой консультации?'
    // ]

    const questionsArray = [
        '1.Насколько вы довольны этой консультацией?',
        '2.Как вы себя чувствуете после сессии по сравнению с тем, как чувствовали себя до неё?',
        '3.Хотели бы вы продолжить работу с чат-ботом в будущем?',
        '4.Насколько чат-бот был полезен в решении вашей проблемы?',
        '5.Чувствуете ли вы эмоциональную поддержку после этой консультации?'
    ];

    const [answers, setAnswers] = useState<Record<string, number | null>>(
        Object.fromEntries(questionsArray.map(q => [q, null]))
    );


    const handleAnswerChange = (question: string, value: any) => {
        setAnswers((prev) => ({
            ...prev,
            [question]: value
        }));
    };

    const sendSurvey = async () => {
        const allAnswersFilled = Object.values(answers).every(value => value !== null);
        console.log(allAnswersFilled)

        if (allAnswersFilled) {
            try {

                const response = await axiosClassic.post("/consultation", {
                    chatId,
                    user,
                    answers
                });

            } catch (error: any) {
                console.error("Ошибка при входе, пробуем /auth/loginPsychologist", error.response?.data?.message);
            }
        }
    }

    return (
        <div>
            <h2>Опрос</h2>

            {questionsArray.map((questionText, qIndex) => (
                <div key={qIndex}>
                    <p>{questionText}</p>
                    <ul style={{ display: 'flex', gap: '8px' }}>
                        {Array.from({ length: 10 }, (_, index) => (
                            <li key={index}>
                                <input
                                    type="radio"
                                    name={questionText}
                                    checked={answers[questionText] === index + 1}
                                    onChange={() => handleAnswerChange(questionText, index + 1)}
                                />
                                {index + 1}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}


            {/* <pre>{JSON.stringify(answers, null, 2)}</pre> */}
            <button onClick={() => sendSurvey()} className="ml-2 p-2 bg-blue-500 text-white rounded-lg">Отправить и закончить консультацию</button>

        </div>
    );
}