import express, { Request, Response } from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import mongoose from "mongoose";

const app = express()
const ioServer = createServer(app)
const io = new Server(ioServer, {
    cors: {
        origin: 'http://localhost:4321',
        methods: ['GET', 'POST']
    }
})

interface Player {
    id: string
    icon: 'X' | 'O'
}

let players: Player[] = []
let boardState = ['', '', '', '', '', '', '', '', '']
let currPlayer = 'X' 

const checkWinner = () => {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
        [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ]
    const winnerCombo = winningCombinations.find(([a, b, c]) => {
        return boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]
    })
  
    if (winnerCombo) {
        return boardState[winnerCombo[0]]
    } else {
        return boardState.includes('') ? null : 'Draw'
    }
}

io.on('connection', (socket) => {
    console.log(`User ${socket.id} has connected`)
    if (players.length < 2) {
        players.push({ id: socket.id, icon: players.length === 0 ? 'X' : 'O' })
        socket.emit('assignSymbol', players[players.length - 1].icon)
    } else {
        socket.emit('spectator')
    }

    io.emit('update players', players.map(player => player.icon))
    socket.on('Play', (data: {
        index: number
        player: string
    }) => {
        if (socket.id === players.find(player => player.icon === currPlayer)?.id && boardState[data.index] === '') {
            boardState[data.index] = data.player
            io.emit('movement', data)

            const winner = checkWinner()
            if (winner) {
                io.emit('game over', {winner})
                boardState = ['', '', '', '', '', '', '', '', '']
                currPlayer = 'X'
            } else {
                currPlayer = currPlayer === 'X' ? 'O' : 'X'
            }
        }
    })

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} has disconnected`)
        players = players.filter(player => player.id !== socket.id)
        io.emit('update players', players.map(player => player.icon))
    })
})

const PORT = process.env.PORT || 3000;

if (!process.env.DATABASE_URI) {
  throw new Error('Missing connection string')
}

// Connect to MongoDB and start server
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Connected to MongoDB: tictactoe')
    }
    ioServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err)
  });