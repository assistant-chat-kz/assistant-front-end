import { axiosClassic } from "@/api/interceptors";

class AdminService {
    private BASE_URL = '/admins'

    async getAdminById(adminId: string) {
        const response = await axiosClassic.get(`${this.BASE_URL}/${adminId}`)
        return response
    }
}

export const adminService = new AdminService()