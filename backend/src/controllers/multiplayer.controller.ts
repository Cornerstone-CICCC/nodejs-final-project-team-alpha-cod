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
    const roomData = rooms.get(room)

        if (roomData && roomData.size < 2) {
            socket.join(room)
            socket.emit('joined', room)
            io.to(room).emit('player joined', socket.id)
            console.log(`User ${socket.id} joined room ${room}`)
            if (roomData.size === 2) {
                const playerIds = Array.from(roomData)
                const assignments = {
                    [playerIds[0]]: 'X',
                    [playerIds[1]]: 'O'
                }
            
                playerIds.forEach((id) => {
                    io.to(id).emit('start game', {
                        yourSymbol: assignments[id],
                        opponentSymbol: assignments[id] === 'X' ? 'O' : 'X',
                        room, 
                    })
                })
            
                console.log(`Game started in room ${room}`)
            }
        } else if (!roomData) {
            socket.emit('no room', 'Room does not exist')
        } else {
            socket.emit('room full', 'Room is full')
        }
    })

    socket.on('tap cell', ({ index, symbol, room }) => {
        io.to(room).emit('update cell', { index, symbol });
    })

    socket.on('disconnect', () => {
        console.log(`${socket.id} has left`)
    })
}