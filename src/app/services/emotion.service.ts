import { axiosClassic } from "@/api/interceptors"

class EmotionService {
    private BASE_URL = '/emotion'

    async emotionPost(text: string) {
        const response = await axiosClassic.post(this.BASE_URL, { text })
        return response
    }
}

export const emotionService = new EmotionService()