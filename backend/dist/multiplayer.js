"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const ioServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(ioServer, {
    cors: {
        origin: 'http://localhost:4321',
        methods: ['GET', 'POST']
    }
});
let players = [];
let boardState = ['', '', '', '', '', '', '', '', ''];
let currPlayer = 'X';
const checkWinner = () => {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
        [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];
    const winnerCombo = winningCombinations.find(([a, b, c]) => {
        return boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c];
    });
    if (winnerCombo) {
        return boardState[winnerCombo[0]];
    }
    else {
        return boardState.includes('') ? null : 'Draw';
    }
};
io.on('connection', (socket) => {
    console.log(`User ${socket.id} has connected`);
    if (players.length < 2) {
        players.push({ id: socket.id, icon: players.length === 0 ? 'X' : 'O' });
        socket.emit('assignSymbol', players[players.length - 1].icon);
    }
    else {
        socket.emit('spectator');
    }
    io.emit('update players', players.map(player => player.icon));
    socket.on('Play', (data) => {
        var _a;
        if (socket.id === ((_a = players.find(player => player.icon === currPlayer)) === null || _a === void 0 ? void 0 : _a.id) && boardState[data.index] === '') {
            boardState[data.index] = data.player;
            io.emit('movement', data);
            const winner = checkWinner();
            if (winner) {
                io.emit('game over', { winner });
                boardState = ['', '', '', '', '', '', '', '', ''];
                currPlayer = 'X';
            }
            else {
                currPlayer = currPlayer === 'X' ? 'O' : 'X';
            }
        }
    });
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} has disconnected`);
        players = players.filter(player => player.id !== socket.id);
        io.emit('update players', players.map(player => player.icon));
    });
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
        console.log('Connected to MongoDB: tictactoe');
    }
    ioServer.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch(err => {
    console.error('MongoDB connection error:', err);
});
