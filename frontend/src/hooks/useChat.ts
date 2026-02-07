import { useEffect, useState } from "react";
import { socket } from "../sockets/chat.ts";

interface ChatMessage {
    sender: "user" | "bot";
    text: string;
}

export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        const onBotMessage = (text: string) => {
            setMessages(prev => [...prev, { sender: "bot", text }]);
        };

        socket.on("botMessage", onBotMessage);

        return () => {
            socket.off("botMessage", onBotMessage);
        };
    }, []);

    const sendMessage = (text: string) => {
        setMessages(prev => [...prev, { sender: "user", text }]);
        socket.emit("chatMessage", text);
    };

    return { messages, sendMessage };
}
