"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiHandler = void 0;
const multiplayer_controller_1 = require("../controllers/multiplayer.controller");
const multiHandler = (io) => {
    const players = {};
    io.on('connection', (socket) => {
        let id = socket.id;
        console.log(`User ${id} has connected.`);
        (0, multiplayer_controller_1.handleMultiEvents)(io, socket, players);
    });
};
exports.multiHandler = multiHandler;
