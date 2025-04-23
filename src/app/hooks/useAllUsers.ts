import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/users.service";
import { IUserResponce } from "@/types/users.types";

export const useAllUsers = () => {
    return useQuery<IUserResponce[]>({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await userService.getUsers();
            return response.data
        }
    })
}