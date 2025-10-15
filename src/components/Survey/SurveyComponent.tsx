import { axiosClassic } from "@/api/interceptors";
import { IQuestionResponce } from "@/types/consultation.types";
import { IUserResponce } from "@/types/users.types";
import { useState } from "react"

interface ISurveyComponent {
    chatId: string | undefined;
    user: IUserResponce | string;
    psyId: string | undefined
}

export default function SurveyComponent({ chatId, user, psyId }: ISurveyComponent) {

    const [endCons, setEndCons] = useState(false)

    const questionsArray = [
        '1. How satisfied are you with this consultation?',
        '2. How do you feel after the session compared to how you felt before it?',
        '3. Would you like to continue working with the chatbot in the future?',
        '4. How helpful was the chatbot in solving your problem?',
        '5. Do you feel emotional support after this consultation?'
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

        if (!allAnswersFilled) return;

        try {
            let response;

            if (typeof user === "string") {

                response = await axiosClassic.post("/consultation/createConsultationNoAuth", {
                    chatId,
                    user,
                    answers,
                    psyId,
                });
            } else {

                response = await axiosClassic.post("/consultation", {
                    chatId,
                    user,
                    answers,
                    psyId,
                });
            }

            setEndCons(true);
        } catch (error: any) {
            console.error(
                "Error creating consultation:",
                error.response?.data?.message || error.message
            );
        }
    };


    return (
        <div>
            {!endCons ? (
                <>
                    <h2>Survey</h2>

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
                    <button onClick={() => sendSurvey()} className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
                        Submit and finish consultation
                    </button>
                </>
            ) : (
                <h2>Consultation completed</h2>
            )}
        </div>
    );
}
