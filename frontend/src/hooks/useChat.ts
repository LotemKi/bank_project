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
        } catch (err) {
            return;
        }

        const onBotMessage = (incoming: any) => {
            const textToDisplay = typeof incoming === "string"
                ? incoming
                : (incoming?.text || "⚠️ The AI is currently unavailable.");

            setMessages(prev => [...prev, {
                sender: "bot",
                text: textToDisplay
            }]);
        };

        socket.on("botMessage", onBotMessage);

        return () => {
            socket.off("botMessage", onBotMessage);
        };
    }, []);

    useEffect(() => {
        const savedMessages = sessionStorage.getItem("chat_history");
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem("chat_history", JSON.stringify(messages));
    }, [messages]);

    const sendMessage = (text: string) => {
        if (!ready) return;

        const socket = getSocket();

        setMessages(prev => [...prev, { sender: "user", text }]);
        socket.emit("chatMessage", text);
    };

    return { messages, sendMessage, ready };
}
