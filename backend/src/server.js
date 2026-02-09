import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './services/db.service.js';
import { registerChatSocket } from "./sockets/chat.socket.js";

const PORT = process.env.PORT || 5000;

await connectDB();

const server = http.createServer(app);

// Initialize Socket.IO
export const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

registerChatSocket(io);

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
