export interface IChatResponce {
    chatId: string;
    members: string[];
    messages: any[]
    call: boolean
    psy?: string
    consultationPsychologistId?: string | null
    consultationStartedAt?: string | null
    consultationEndedAt?: string | null
    surveyRequestedAt?: string | null
    surveyCompletedAt?: string | null
}
