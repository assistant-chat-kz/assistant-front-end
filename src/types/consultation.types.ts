import { IUserResponce } from "./users.types";

export interface IQuestionResponce {
    chatId: string;
    userId: string;
    question: string;
    answer: string
}

export interface IConsultationResponce {
    chatId: string;
    createdAt: string;
    userId: string,
    psyId: string,
    questions: IQuestionResponce[]
    userNoAuthId: string
}