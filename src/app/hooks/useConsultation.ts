import { useQuery } from "@tanstack/react-query";
import { consultationService } from "../services/consultation.service";
import { IConsultationResponce } from "@/types/consultation.types";

export const useConsultation = (chatId: string, userId: string) => {
    return useQuery<IConsultationResponce>({
        queryKey: ['consultation', chatId, userId],
        queryFn: () => consultationService.getConsulataionsById(chatId, userId),
        enabled: !!chatId && !!userId,
    });
};