import { handleChatMessage } from "../services/chat.service.js";

export function registerChatSocket(io) {
    io.on("connection", (socket) => {

        socket.userId = socket.handshake.auth.userId;

        socket.emit("botMessage", {
            role: "bot",
            content: "Hello. How can I help you today?"
        });

        socket.on("chatMessage", async (message) => {
            if (!socket.userId) {
                return socket.emit("botMessage", "Unauthorized");
            }

            const response = await handleChatMessage({
                userId: socket.userId,
                message
            });

            io.to(socket.userId).emit("balance:update", response.updatedBalance);

            socket.emit("botMessage", response);
        });
    });
}


