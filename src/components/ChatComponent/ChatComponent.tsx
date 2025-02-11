import React, { useState } from "react";

export default function ChatComponent() {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('http://localhost:4200/api/yandex-gpt/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: input }),
        });


        const data = await res.json();
        setResponse(data.response);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Введите сообщение..."
                />
                <button type="submit">Отправить</button>
            </form>
            <p>Ответ: {response}</p>
        </div>
    );
}