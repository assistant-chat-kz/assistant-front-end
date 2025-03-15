import { axiosClassic } from "@/api/interceptors";

class AdminService {
    private BASE_URL = '/admins'

    async getAdmins() {
        const response = await axiosClassic.get(this.BASE_URL)
        return response
    }

    async getAdminById(userId: string) {
        const response = await axiosClassic.get(`${this.BASE_URL}/${userId}`)
        return response
    }
}

export const adminService = new AdminService()