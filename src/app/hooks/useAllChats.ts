import { useQuery } from "@tanstack/react-query";

import { chatService } from "../services/chat.service";
import { IChatResponce } from "@/types/chats.types";

export const useAllChats = () => {
    return useQuery<IChatResponce[]>({
        queryKey: ['chat'],
        queryFn: async () => {
            const response = await chatService.getAllChats();
            return response.data
        }
    })
}