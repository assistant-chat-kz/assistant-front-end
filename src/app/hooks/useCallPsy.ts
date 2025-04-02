import { IChatResponce } from "@/types/chats.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { chatService } from "../services/chat.service";

export function useCallPsy() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    async function callPsychologist(chatId: string | undefined, call: boolean) {
        setLoading(true);
        setError(null);
        try {
            const response = await chatService.callPsyInChat(chatId as string, call);
            console.log("✅ Психолог вызван:", response.data);

            queryClient.invalidateQueries(["chat", chatId])
        } catch (err: any) {
            console.error("❌ Ошибка при вызове психолога:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return { callPsychologist, loading, error };
}