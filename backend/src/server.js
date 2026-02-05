import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './services/db.service.js';

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

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('chatMessage', (msg) => {
        console.log('Received from client:', msg);

        const botReply = `Bot says: ${msg.split('').reverse().join('')}`;

        socket.emit('botMessage', botReply);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
