import { axiosClassic } from "@/api/interceptors";

class ChatHistoryService {
    private BASE_URL = '/chat-history'

    async getChatHistory(chatId: string) {
        const response = await axiosClassic.get(`${this.BASE_URL}/${chatId}`)
        return response
    }
}

export const chatHistoryService = new ChatHistoryService()