import { handleChatMessage } from "../services/chat.service.js";

export function registerChatSocket(io) {
    io.on("connection", (socket) => {

        socket.userId = socket.handshake.auth.userId;

        // join a room per-userId so server can emit updates to all tabs/devices
        if (socket.userId) {
            socket.join(socket.userId);
        }

        // send an initial greeting with `text` so clients display it correctly
        socket.emit("botMessage", {
            text: "Hello. How can I help you today?",
            role: "bot"
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
            }

            socket.emit("botMessage", response);
        });
    });
}


