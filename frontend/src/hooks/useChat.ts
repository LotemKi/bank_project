import { useEffect, useState } from "react";
import { getSocket } from "../sockets/chat";
import { useAuth } from "./useAuth";

interface ChatMessage {
    sender: "user" | "bot";
    text: string;
}

export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [ready, setReady] = useState(false);
    const { refreshProfile } = useAuth();

    useEffect(() => {
        let socket;

        try {
            socket = getSocket();
            setReady(true);
        } catch (err) {
            return;
        }

        const onBotMessage = async (incoming: any) => {
            // Normalize incoming message shapes from server
            // Supported shapes:
            // - string
            // - { text: '...'}
            // - { content: '...' } or { content: { text: '...'} }
            // - model responses with updatedBalance
            let textToDisplay = "⚠️ The AI is currently unavailable.";

            if (typeof incoming === "string") {
                textToDisplay = incoming;
            } else if (incoming?.text) {
                textToDisplay = incoming.text;
            } else if (incoming?.content) {
                if (typeof incoming.content === "string") textToDisplay = incoming.content;
                else if (incoming.content?.text) textToDisplay = incoming.content.text;
            } else if (incoming?.message) {
                textToDisplay = incoming.message;
            }

            setMessages(prev => [...prev, { sender: "bot", text: textToDisplay }]);

            // If server included updatedBalance in the payload, refresh profile
            if (typeof incoming?.updatedBalance === "number") {
                try { await refreshProfile(); } catch (e) { }
            }
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
