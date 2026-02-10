import { useEffect, useState } from "react";
import { getSocket } from "../sockets/chat";

interface ChatMessage {
    sender: "user" | "bot";
    text: string;
}

export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let socket;

        try {
            socket = getSocket();
            setReady(true);
        } catch {
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
        if (!ready) return;

        const socket = getSocket();

        setMessages(prev => [...prev, { sender: "user", text }]);
        socket.emit("chatMessage", text);
    };

    return { messages, sendMessage, ready };
}
