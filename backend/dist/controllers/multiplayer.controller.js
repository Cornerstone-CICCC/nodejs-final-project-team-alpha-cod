"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMultiEvents = void 0;
const handleMultiEvents = (io, socket, players) => {
    socket.on('disconnect', () => {
        console.log(`${socket.id} has left`);
    });
};
exports.handleMultiEvents = handleMultiEvents;
