import { useQuery } from "@tanstack/react-query";
import { chatService } from "../services/chat.service";

export const useChat = (userId?: string) => {
    return useQuery({
        queryKey: ['chatId', userId],
        queryFn: async () => {
            const response = await chatService.getChat(userId as string)
            return response.data
        },
        enabled: !!userId
    })
}