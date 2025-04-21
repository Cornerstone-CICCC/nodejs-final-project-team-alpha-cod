"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiHandler = void 0;
const multiplayer_controller_1 = require("../controllers/multiplayer.controller");
const multiHandler = (io) => {
    let connPLayers = 0;
    const players = {};
    io.on('connection', (socket) => {
        console.log(`User ${socket.id} has connected.`);
        connPLayers = connPLayers + 1;
        // if (connPLayers > 2) {
        //     console.log(`User ${socket.id} was not able to connect`)
        // }
        (0, multiplayer_controller_1.handleMultiEvents)(io, socket, players);
    });
};
exports.multiHandler = multiHandler;
