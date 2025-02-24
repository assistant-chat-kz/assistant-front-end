import { useQuery } from "@tanstack/react-query";
import { chatHistoryService } from "../services/chat.history.service";

export const useChatHistory = (userId?: string) => {
    return useQuery({
        queryKey: ['chatId', userId],
        queryFn: async () => {
            const response = await chatHistoryService.getChatHistory(userId as string)
            return response.data
        },
        enabled: !!userId
    })
}