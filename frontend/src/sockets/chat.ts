import { io, Socket } from "socket.io-client";

io.emit("botMessage", "...");

export interface ServerToClientEvents {
    botMessage: (message: string) => void;
}

export interface ClientToServerEvents {
    chatMessage: (message: string) => void;
}

export const socket: Socket<
    ServerToClientEvents,
    ClientToServerEvents
> = io(import.meta.env.VITE_SOCKET_URL, {
    autoConnect: true,
});
