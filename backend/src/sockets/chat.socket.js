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

            if (typeof response.updatedBalance === "number") {
                io.to(socket.userId).emit("balance:update", response.updatedBalance);
                console.log(`[SOCKET EMIT]: Sent balance update to user ${socket.userId}: ${response.updatedBalance} ILS`);
            }

            socket.emit("botMessage", response);
        });
    });
}


