import { useEffect, useState } from "react";
import { getSocket } from "../sockets/chat.ts";

interface ChatMessage {
    sender: "user" | "bot";
    text: string;
}

export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) {
            console.error("Socket not initialized");
            return;
        }

        const onBotMessage = (text: string) => {
            setMessages(prev => [...prev, { sender: "bot", text }]);
        };

        socket.on("botMessage", onBotMessage);

        return () => {
            socket.off("botMessage", onBotMessage);
        };
    }, []);

    const sendMessage = (text: string) => {
        const socket = getSocket();
        if (!socket) {
            console.error("Socket not initialized");
            return;
        }
        setMessages(prev => [...prev, { sender: "user", text }]);
        socket.emit("chatMessage", text);
    };

    return { messages, sendMessage };
}
