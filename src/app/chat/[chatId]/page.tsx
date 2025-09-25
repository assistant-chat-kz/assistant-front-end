"use client";

import { useParams, useRouter } from "next/navigation";
import ChatComponent from "@/components/ChatComponent/ChatComponent";
import { useChat } from "@/app/hooks/useChat";
import { getUserId } from "@/app/hooks/getUserId";
import Modal from "@/components/Modal/Modal";
import { SetStateAction, useEffect, useState } from "react";
import SetNameModal from "@/components/SetNameModal/SetNameModal";
import { useUser } from "@/app/hooks/useUser";


export default function ChatPage() {

    const params = useParams() as { chatId: string };

    const { chatId } = params

    const userId = getUserId()
    const userIdNoAuth = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    const [openModal, setOpenModal] = useState(false)

    const { data: user, isLoading: isLoadinUser } = useUser(userId)
    const { data: chat, isLoading } = useChat(chatId)

    const messagesInChat = chat?.messages

    useEffect(() => {
        if (!isLoadinUser) {
            if (user?.name) {
                setOpenModal(false)
            } else {
                setOpenModal(true)
            }
        }
    }, [])

    return (
        <div>
            <SetNameModal openModal={openModal} setOpenModal={setOpenModal} userId={userId} />
            {!isLoading ? <ChatComponent chatId={chatId} user={user} messagesInChat={messagesInChat} /> : 'Loading...'}
        </div>

    );
}
