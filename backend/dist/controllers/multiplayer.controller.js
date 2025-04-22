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
        if (rooms.has(room)) {
            socket.join(room);
            socket.emit('joined', room);
            io.to(room).emit('player joined', socket.id);
            console.log(`User ${socket.id} joined room`);
        }
        socket.emit('no room', 'Room does not exist');
    });
    socket.on('disconnect', () => {
        console.log(`${socket.id} has left`);
    });
};
exports.handleMultiEvents = handleMultiEvents;
