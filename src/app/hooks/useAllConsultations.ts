import { IConsultationResponce } from "@/types/consultation.types";
import { useQuery } from "@tanstack/react-query";
import { consultationService } from "../services/consultation.service";

export const useAllConsultations = () => {
    return useQuery<IConsultationResponce[]>({
        queryKey: ['consultation'],
        queryFn: async () => {
            const response = await consultationService.getAllConsultation()
            return response.data
        }
    })
}