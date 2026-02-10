import { io, Socket } from "socket.io-client";

export interface ServerToClientEvents {
    botMessage: (message: string) => void;
}

export interface ClientToServerEvents {
    chatMessage: (message: string) => void;
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export const initSocket = (userId: string) => {
    if (socket) return socket;

    socket = io(import.meta.env.VITE_SOCKET_URL as string, {
        autoConnect: false,
        transports: ["websocket"],
        auth: { userId },
    });

    socket.on("connect", () => {
        console.log("SOCKET CONNECTED in chat.ts:", socket!.id);
    });

    socket.on("connect_error", (err) => {
        console.error("SOCKET CONNECT ERROR:", err.message);
    });

    socket.connect();
    return socket;
};

export function getSocket() {
    if (!socket) {
        throw new Error("Socket not initialized in chat.ts");
    }
    return socket;
}