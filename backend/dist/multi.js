"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const multi_handler_1 = require("./socket/multi.handler");
// Create server
const app = (0, express_1.default)();
const ioServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(ioServer, {
    cors: {
        origin: 'http://localhost:4321', // Astro port
        methods: ['GET', 'POST']
    }
});
(0, multi_handler_1.multiHandler)(io);
// Start server
const PORT = process.env.PORT || 3000;
ioServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
