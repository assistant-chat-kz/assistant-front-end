import { useState } from "react";
import { chatService } from "../services/chat.service";
import { useQueryClient } from "@tanstack/react-query";


export function usePsyInChat() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    async function psyInChat(chatId: string | undefined, psyId: string | undefined) {
        setLoading(true);
        setError(null);
        try {
            const response = await chatService.insertPsyInChat(chatId as string, psyId as string);
            console.log("✅ Психолог добавлен в чат:", response.data);

            //@ts-ignore
            queryClient.invalidateQueries(["chat", chatId])
        } catch (err: any) {
            console.error("❌ Ошибка при добавлении психолога в чат:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return { psyInChat, loading, error };
}

