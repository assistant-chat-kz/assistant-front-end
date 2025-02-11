import { useState } from "react";
import { MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";

export default function ChatComponent() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        const userMessage = {
            position: "right",
            type: "text",
            title: "User",
            text: input,
        };

        setMessages((prev) => [...prev, userMessage]);

        try {
            const res = await fetch("http://localhost:4200/api/yandex-gpt/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: `Ты профессиональный психолог-ассистент. Общайся так, чтобы поддерживать, давать полезные советы и помогать пользователю разобраться в своих чувствах. Отправляй короткие ответы. \n\nПользователь: ${input}\nПсихолог:`,
                }),
            });

            const data = await res.json();

            const botMessage = {
                position: "left",
                type: "text",
                title: "Ассистент",
                text: data.response,
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error fetching response:", error);
        }

        setInput("");
    };

    return (
        <div className="max-w-md mx-auto border border-gray-300 p-4 rounded-lg">
            <div className="h-96 min-h-400 overflow-y-auto p-2 bg-white rounded-lg">
                {messages.map((msg, index) => (
                    <MessageBox key={index} {...msg} />
                ))}
            </div>
            <form onSubmit={handleSubmit} className="flex mt-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                />
                <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-lg">Отправить</button>
            </form>
        </div>
    );
}
