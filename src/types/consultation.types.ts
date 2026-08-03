import { IUserResponce } from "./users.types";

export interface IQuestionResponce {
    chatId: string;
    userId: string;
    question: string;
    answer: string
}

export interface IConsultationResponce {
    id: string;
    chatId: string;
    sessionStartedAt?: string | null;
    createdAt: string;
    userId: string | null,
    psyId: string | null,
    questions: IQuestionResponce[]
    userNoAuthId: string | null
}
