import { Server, Socket } from "socket.io";

export const handleMultiEvents = (
    io: Server,
    socket: Socket,
    players: Record<string, string>
) => {

    socket.on('invite', () => {
        socket.join(socket.id)
        socket.emit('new room', socket.id)
        console.log(`room created: ${socket.id}`)
    })

    socket.on('join room', (room) => {
        const rooms = io.sockets.adapter.rooms
        if (rooms.has(room)) {
            socket.join(room)
            socket.emit('joined', room)
            io.to(room).emit('player joined', socket.id)
            console.log(`User ${socket.id} joined room`)
        }
        socket.emit('no room', 'Room does not exist')
    })

    socket.on('disconnect', () => {
        console.log(`${socket.id} has left`)
    })
}