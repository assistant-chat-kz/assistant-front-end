import { useQuery } from "@tanstack/react-query";
import { consultationService } from "../services/consultation.service";
import { IConsultationResponce } from "@/types/consultation.types";

export const useConsultation = (chatId: string | undefined, userId: string | undefined) => {
    return useQuery<IConsultationResponce>({
        queryKey: ['consultation', chatId, userId],
        queryFn: () => consultationService.getConsulataionsById(chatId as string, userId as string),
        enabled: !!chatId && !!userId,
    });
};