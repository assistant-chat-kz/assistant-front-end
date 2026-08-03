import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/users.service";
import { IUserAnalytics } from "@/types/users.types";

export const useUserAnalytics = () => {
    return useQuery<IUserAnalytics>({
        queryKey: ["user-analytics"],
        queryFn: async () => {
            const response = await userService.getAnalytics();
            return response.data;
        },
    });
};
