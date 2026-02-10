import { handleChatMessage } from "../services/chat.service.js";

export function registerChatSocket(io) {
    io.on("connection", (socket) => {
        console.log("before SOCKET handshake CONNECTED:", socket.id, "USER ID:", socket.userId);

        socket.userId = socket.handshake.auth.userId;
        console.log("SOCKET CONNECTED:", socket.id, "USER ID:", socket.userId);

        socket.on("chatMessage", async (message) => {
            if (!socket.userId) {
                return socket.emit("botMessage", "Unauthorized");
            }

            const response = await handleChatMessage({
                userId: socket.userId,
                message
            });

            socket.emit("botMessage", response);
        });
    });
}


