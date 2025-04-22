"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const socket_handler_1 = require("./sockets/socket.handler");
const app = (0, express_1.default)();
const ioServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(ioServer, {
    cors: {
        origin: 'http://localhost:4321', // Removed trailing slash
        methods: ['GET', 'POST']
    }
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Frontend CORS
app.use((0, cors_1.default)({
    origin: 'http://localhost:4321',
    credentials: true
}));
// Initialize sockets
(0, socket_handler_1.socketHandler)(io);
// User routes
app.use('/user', user_routes_1.default);
// Root route
app.get('/', (req, res) => {
    res.status(200).send('Welcome to my server');
});
// Fallback route
app.use((req, res) => {
    res.status(404).send('Invalid route!');
});
const PORT = process.env.PORT || 3000;
if (!process.env.DATABASE_URI) {
    throw new Error('Missing connection string');
}
// Connect to MongoDB and start server
mongoose_1.default
    .connect(process.env.DATABASE_URI)
    .then(() => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('Connected to MongoDB: Tictactoe');
    }
    ioServer.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch(err => {
    console.error('MongoDB connection error:', err);
});
