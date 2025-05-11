import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:4200";

export const useSocket = (userId: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket: Socket = io(SOCKET_SERVER_URL, {
            transports: ["websocket"],
            query: { userId },
        });

        newSocket.on("connect", () => {
            console.log("✅ Подключено к WebSocket:", newSocket.id);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [userId]);

    return socket;
};
