"use client";

import { useAllChats } from "../hooks/useAllChats";

export default function ChatList() {

    const { data: chats } = useAllChats()

    return (
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            {chats?.map(chat => (
                <button
                    key={chat.chatId}
                    className="mt-10 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600"
                >
                    {chat.chatId}
                </button>
            ))}
        </div>
    );
}