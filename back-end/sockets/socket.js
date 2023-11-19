import { Server as SocketIO } from "socket.io";
import redisClient from "../data-store/redis.js";

let ioInstance;

export function initializeSocket(server, options) {
    const io = new SocketIO(server, options);

    io.on("connection", (socket) => {
        console.log("New socket connection:", socket.id);

        socket.on("identifyUser", (userId) => {
            console.log("User identified:", userId);

            redisClient.set(userId.toString(), socket.id);

            socket.on("disconnect", () => {
                console.log("A client disconnected");
                redisClient.del(userId.toString());
            });
        });
    });

    ioInstance = io;

    return io;
}

export function emitGlobalEvent(eventName, eventData) {
    if (ioInstance) {
        ioInstance.emit(eventName, eventData);
    }
}

export function emitEventToClient(userId, eventName, eventData) {
    const socketId = redisClient.get(userId);
    if (socketId) {
        ioInstance.to(socketId).emit(eventName, eventData);
    }
}
