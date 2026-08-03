import { axiosClassic } from "@/api/interceptors";
import { IUserNoAuthResponce, IUserResponce } from "@/types/users.types";

class UserService {
    private BASE_URL = '/users'

    async getUsers() {
        const response = await axiosClassic.get(this.BASE_URL)
        return response
    }

    async getUsersNoAuth() {
        const response = await axiosClassic.get(`${this.BASE_URL}/noAuth`)
        return response
    }

    async getAnalytics() {
        const response = await axiosClassic.get(`${this.BASE_URL}/analytics`)
        return response
    }

    async getUserById(userId: string) {
        const response = await axiosClassic.get(`${this.BASE_URL}/${userId}`)
        return response
    }

    async verifyUser(userId: string) {
        const response = await axiosClassic.put(`${this.BASE_URL}/${userId}/verify`)
        return response
    }

    async visitUser(userId: string, sessionId: string) {
        const response = await axiosClassic.put(`${this.BASE_URL}/${userId}/visit`, { sessionId })
        return response
    }

    async updateUser(userId: string, data: Partial<IUserResponce> | Partial<IUserNoAuthResponce>) {
        return axiosClassic.put(`${this.BASE_URL}/${userId}`, data)
    }
}

export const userService = new UserService()
