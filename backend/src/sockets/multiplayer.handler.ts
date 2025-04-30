import { Server } from "socket.io";
import { handleMultiEvents } from "../controllers/multiplayer.controller";

export const multiHandler = (io: Server) => {
    
    const players: Record<string, string> = {}

    io.on('connection', (socket) => {
        let id = socket.id
        console.log(`User ${id} has connected.`)
        handleMultiEvents(io, socket, players)
    })
}