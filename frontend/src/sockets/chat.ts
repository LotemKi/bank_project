import { io, type Socket } from "socket.io-client";

export interface ServerToClientEvents {
    botMessage: (message: string) => void;
}

export interface ClientToServerEvents {
    chatMessage: (message: string) => void;
}

const userId = localStorage.getItem("userId");

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
    io(import.meta.env.VITE_SOCKET_URL as string, {
        autoConnect: true,
        auth: {
            userId
        }
    });
