"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHandler = void 0;
const socket_controller_1 = require("../controllers/socket.controller");
const socketHandler = (io) => {
    // List of clients
    const users = {};
    // Socket.io events
    io.on('connection', (socket) => {
        console.log(`${socket.id} has joined`);
        (0, socket_controller_1.handleSocketEvents)(io, socket, users);
    });
};
exports.socketHandler = socketHandler;
