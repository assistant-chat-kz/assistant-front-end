"use client";

import { useParams } from "next/navigation";
import ChatComponent from "@/components/ChatComponent/ChatComponent";
import { useChat } from "@/app/hooks/useChat";
import { getUserId } from "@/app/hooks/getUserId";
import { useEffect, useState } from "react";
import SetNameModal from "@/components/SetNameModal/SetNameModal";
import { useUser } from "@/app/hooks/useUser";
import { usePsy } from "@/app/hooks/usePsy";


export default function ChatPage() {

    const params = useParams() as { chatId: string };

    const { chatId } = params

    const userId = getUserId()
    const [openModal, setOpenModal] = useState(false)

    const { data: user, isLoading: isLoadingUser } = useUser(userId)
    const { data: psychologist, isLoading: isLoadingPsychologist } = usePsy(userId)
    const { data: chat, isLoading } = useChat(chatId)

    const messagesInChat = chat?.messages

    useEffect(() => {
        if (isLoadingUser || isLoadingPsychologist) return;

        // A psychologist already has a name in their own profile. The name
        // modal is only for anonymous users whose profile is stored in UserNoAuth.
        setOpenModal(!psychologist && !user?.name);
    }, [isLoadingUser, isLoadingPsychologist, psychologist, user?.name])

    return (
        <div>
            <SetNameModal openModal={openModal} setOpenModal={setOpenModal} userId={userId} />
            {!isLoading ? <ChatComponent chatId={chatId} user={user} messagesInChat={messagesInChat} /> : 'Loading...'}
        </div>

    );
}
