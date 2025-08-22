import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/users.service";
import { IUserNoAuthResponce } from "@/types/users.types";

export const useAllUsersNoAuth = () => {
    return useQuery<IUserNoAuthResponce[]>({
        queryKey: ['userNoAuth'],
        queryFn: async () => {
            const response = await userService.getUsersNoAuth();
            return response.data
        }
    })
}