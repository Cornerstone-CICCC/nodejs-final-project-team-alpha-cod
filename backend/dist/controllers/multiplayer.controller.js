"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMultiEvents = void 0;
const handleMultiEvents = (io, socket, players) => {
    socket.on('invite', () => {
        socket.join(socket.id);
        socket.emit('new room', socket.id);
        console.log(`room created: ${socket.id}`);
    });
    socket.on('join room', (room) => {
        const rooms = io.sockets.adapter.rooms;
        const roomData = rooms.get(room);
        if (roomData && roomData.size < 2) {
            socket.join(room);
            socket.emit('joined', room);
            io.to(room).emit('player joined', socket.id);
            console.log(`User ${socket.id} joined room ${room}`);
            if (roomData.size === 2) {
                const players = Array.from(roomData);
                const assignments = {
                    [players[0]]: 'X',
                    [players[1]]: 'O'
                };
                players.forEach((id) => {
                    io.to(id).emit('start game', {
                        yourSymbol: assignments[id],
                        opponentSymbol: assignments[id] === 'X' ? 'O' : 'X',
                    });
                });
                console.log(`Game started in room ${room}`);
            }
        }
        else if (!roomData) {
            socket.emit('no room', 'Room does not exist');
        }
        else {
            socket.emit('room full', 'Room is full');
        }
    });
    socket.on('disconnect', () => {
        console.log(`${socket.id} has left`);
    });
};
exports.handleMultiEvents = handleMultiEvents;
