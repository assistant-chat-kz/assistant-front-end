import { axiosClassic } from "@/api/interceptors";
import { IQuestionResponce } from "@/types/consultation.types";
import { IUserResponce } from "@/types/users.types";

class ConsultationService {
    private BASE_URL = '/consultation'

    async createConsultation(chatId: string, user: IUserResponce, questions: IQuestionResponce[]) {
        const response = await axiosClassic.post(this.BASE_URL, { chatId, user, questions })
        return response
    }

    async getConsulataionsById(chatId: string, userId: string) {
        const response = await axiosClassic.get(`${this.BASE_URL}/${chatId}`, {
            params: { userId }
        });

        return response.data
    }
}

export const consultationService = new ConsultationService()