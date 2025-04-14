"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_handler_1 = require("./sockets/socket.handler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const ioServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(ioServer, {
    cors: {
        origin: 'http://localhost:4321',
        methods: ['GET', 'POST']
    }
});
// Conexión a MongoDB
const MONGO_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/chatapp';
mongoose_1.default.connect(MONGO_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    // Solo arrancamos el servidor si MongoDB está conectado
    const PORT = 3500;
    ioServer.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('MongoDB connection error:', err);
});
// Iniciar sockets
(0, socket_handler_1.socketHandler)(io);
