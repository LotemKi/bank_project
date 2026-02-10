import { useState } from "react";
import { useChat } from "../hooks/useChat";

export function ChatPanel() {
    const { messages, sendMessage, ready } = useChat();
    const [input, setInput] = useState("");

    return (
        <div>
            <div>
                {messages.map((m, i) => (
                    <div key={i}>
                        <strong>{m.sender}:</strong> {m.text}
                    </div>
                ))}
            </div>

            <input
                disabled={!ready}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage(input)}
            />
            <button onClick={() => sendMessage(input)}>Send</button>
        </div>
    );
}