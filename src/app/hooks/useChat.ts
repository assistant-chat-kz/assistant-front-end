import { IChatResponce } from "@/types/chats.types";
import { useQuery } from "@tanstack/react-query";
import { chatService } from "../services/chat.service";

export const useChat = (chatId?: string) => {
    return useQuery<IChatResponce>({
        queryKey: ['chatId', chatId],
        queryFn: async () => {
            const response = await chatService.getChat(chatId as string)
            return response.data
        },
        enabled: !!chatId
    })
}