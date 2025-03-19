import { useQuery } from "@tanstack/react-query";
import { psyService } from "../services/psy.service";
import { IPsyResponce } from "@/types/psy.types";

export const usePsy = (userId?: string) => {
    return useQuery<IPsyResponce>({
        queryKey: ['psy', userId],
        queryFn: async () => {
            const response = await psyService.getPsyById(userId as string);
            return response.data
        },
        enabled: !!userId
    })
}