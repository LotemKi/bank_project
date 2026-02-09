import { handleChatMessage } from "../services/chat.service.js";

export function registerChatSocket(io) {
    io.on("connection", (socket) => {
        const { userId } = socket.handshake.auth;

        console.log("CONNECTED userId =", userId);

        if (!userId) {
            socket.emit("botMessage", "Unauthorized");
            return;
        }

        socket.userId = userId;

        socket.on("chatMessage", async (message) => {
            console.log("MESSAGE:", socket.userId, message);

            const response = await handleChatMessage({
                userId: socket.userId,
                message
            });

            console.log("RESPONSE:", response);

            socket.emit("botMessage", response);
        });
    });
}

