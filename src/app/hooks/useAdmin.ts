import { useQuery } from "@tanstack/react-query";
import { adminService } from "../services/admins.service";
import { IAdminResponce } from "@/types/admins.types";

export const useAdmin = (userId?: string) => {
    return useQuery<IAdminResponce>({
        queryKey: ['admin', userId],
        queryFn: async () => {
            const response = await adminService.getAdminById(userId as string);
            return response.data
        },
        enabled: !!userId
    })
}