import { axiosClassic } from "@/api/interceptors";

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
}

export const userService = new UserService()