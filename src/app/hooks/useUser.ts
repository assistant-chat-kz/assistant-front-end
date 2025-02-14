import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/users.service";
import { IUserResponce } from "@/types/users.types";

export const useUser = (userId?: string) => {
    return useQuery<IUserResponce>({
        queryKey: ['user', userId],
        queryFn: async () => {
            const response = await userService.getUserById(userId as string);
            return response.data
        },
        enabled: !!userId
    })
}