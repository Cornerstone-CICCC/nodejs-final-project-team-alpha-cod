"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiHandler = void 0;
const multi_controller_1 = require("../controllers/multi.controller");
const multiHandler = (io) => {
    io.on('connection', (socket) => {
        console.log(`${socket.id} has joined`);
        (0, multi_controller_1.handleMultiEvents)(io, socket);
    });
};
exports.multiHandler = multiHandler;
