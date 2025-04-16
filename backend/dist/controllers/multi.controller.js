"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMultiEvents = void 0;
const handleMultiEvents = (io, socket, users) => {
    socket.emit('connect', {
        message: 'Welcome to our amazing chat! Have fun!'
    });
    // Listening for new updates to chat event
    socket.on('disconnect', () => {
        console.log(`${socket.id} has disconnected :(`);
    });
};
exports.handleMultiEvents = handleMultiEvents;
