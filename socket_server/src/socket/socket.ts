import { Server, Socket } from 'socket.io';
import http from 'http';
import app from '../app.js';
import { removeUserDetailsSafe } from '../cache/userDetails.js';

const server: http.Server = http.createServer(app);
const io: Server = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

io.on('connection', (socket: Socket): void => {
    const userId: string = socket.handshake.auth?.userId;
    if (!userId) {
        socket.disconnect(true);
        return;
    }
    console.log(`New client connected: ${userId}`);
    socket.join(userId);

    socket.on("join_room", (roomId: string): void => {
        socket.join(roomId);
        socket.to(roomId).emit("user_joined", { userId });
    })

    socket.on("offer", ({ offer, roomId }: { offer: RTCSessionDescriptionInit, roomId: string }): void => {
        socket.to(roomId).emit("offer", { from: userId, offer });
    });

    socket.on("answer", ({ answer, roomId }: { answer: RTCSessionDescriptionInit, roomId: string }): void => {
        socket.to(roomId).emit("answer", { from: userId, answer });
    });

    socket.on("ice_candidate", ({ candidate, roomId }: { candidate: RTCIceCandidateInit, roomId: string }): void => {
        socket.to(roomId).emit("ice_candidate", { from: userId, candidate });
    });

    socket.on("leave_room", (userId): void => {
        socket.leave(userId);
    });

    socket.on('disconnect', async (): Promise<void> => {
        try {
            socket.leave(userId);

            removeUserDetailsSafe(userId);

            await fetch(`${process.env.SERVER_URL}/logic/remove`, {
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({ userId1: userId }),
            }).catch(() => { });

            console.log(`Client disconnected: ${userId}`);
        } catch (err) {
            console.error("disconnect cleanup error:", err);
        }
    });

});

export { server, io };