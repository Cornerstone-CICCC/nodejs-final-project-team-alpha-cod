import { Server } from "socket.io";
import { handleMultiEvents } from "../controllers/multi.controller";

export const multiHandler = (io: Server) => {
    // List of clients
    const users: Record<string, string> = {}

    // Socket.io events
    io.on('connection', (socket) => {
        console.log(`${socket.id} has joined`)
        handleMultiEvents(io, socket, users)
    })
    
    io.on('disconnect', (socket) => {
        console.log(`${socket.id} has left the server`)
        handleMultiEvents(io, socket, users)
    })
}