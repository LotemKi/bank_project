import { handleChatMessage } from "../services/chat.service.js";

export function registerChatSocket(io) {
    io.on("connection", (socket) => {

        socket.on("chatMessage", async (message) => {
            const response = await handleChatMessage({
                userId: socket.userId,
                message
            });

            socket.emit("botMessage", response);
        });

    });
}
