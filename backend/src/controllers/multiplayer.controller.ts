import { Server, Socket } from "socket.io";

export const handleMultiEvents = (
    io: Server,
    socket: Socket,
    players: Record<string, string>
) => {
    socket.on('disconnect', () => {
        console.log(`${socket.id} has left`)
    })
}