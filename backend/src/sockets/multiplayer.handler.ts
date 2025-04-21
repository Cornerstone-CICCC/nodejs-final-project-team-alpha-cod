import { Server } from "socket.io";
import { handleMultiEvents } from "../controllers/multiplayer.controller";

export const multiHandler = (io: Server) => {
    let connPLayers: number = 0
    const players: Record<string, string> = {}

    io.on('connection', (socket) => {
        console.log(`User ${socket.id} has connected.`)
        connPLayers = connPLayers + 1
        // if (connPLayers > 2) {
        //     console.log(`User ${socket.id} was not able to connect`)
        // }
        handleMultiEvents(io, socket, players)
    })
}