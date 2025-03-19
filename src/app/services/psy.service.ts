import { axiosClassic } from "@/api/interceptors";

class PsyService {
    private BASE_URL = '/psychologists'

    async getPsy() {
        const response = await axiosClassic.get(this.BASE_URL)
        return response
    }

    async getPsyById(userId: string) {
        const response = await axiosClassic.get(`${this.BASE_URL}/${userId}`)
        return response
    }
}

export const psyService = new PsyService()