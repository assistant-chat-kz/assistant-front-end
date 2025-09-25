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

    async getUserById(userId: string) {
        const response = await axiosClassic.get(`${this.BASE_URL}/${userId}`)
        return response
    }

    async verifyUser(userId: string) {
        const response = await axiosClassic.put(`${this.BASE_URL}/${userId}`)
        return response
    }

    async visitUser(userId: string) {
        const response = await axiosClassic.put(`${this.BASE_URL}/${userId}/visit`)
        return response
    }

    async updateUser(userId: string, data: Partial<IUserResponce> | Partial<IUserNoAuthResponce>) {
        return axiosClassic.put(`${this.BASE_URL}/${userId}`, data)
    }
}

export const userService = new UserService()