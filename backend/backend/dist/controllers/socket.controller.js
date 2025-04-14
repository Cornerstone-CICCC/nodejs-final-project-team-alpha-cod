"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocketEvents = void 0;
const handleSocketEvents = (io, socket, users) => {
    socket.emit('chat', {
        message: 'Welcome to our amazing chat! Have fun!'
    });
    socket.broadcast.emit('chat', {
        message: `A new user just joined chat`
    });
    // Listening for new updates to chat event
    socket.on('chat', (data) => {
        users[socket.id] = data.username;
        io.emit('chat', {
            username: data.username,
            message: data.message
        });
    });
    socket.on('disconnect', () => {
        console.log(`${socket.id} has disconnected :(`);
        io.emit('chat', {
            message: `${users[socket.id]} just left chat.`
        });
    });
};
exports.handleSocketEvents = handleSocketEvents;
