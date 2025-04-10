import { IUserResponce } from "./users.types";

export interface IQuestionResponce {
    chatId: string;
    userId: string;
    question: string;
    answer: string
}

export interface IConsultationResponce {
    chatId: string;
    user: IUserResponce,
    questions: IQuestionResponce[]
}