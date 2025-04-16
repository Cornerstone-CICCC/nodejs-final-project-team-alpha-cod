import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { createServer } from 'http'
import { Server } from 'socket.io'
import { multiHandler } from './socket/multi.handler'

// Create server
const app = express()
const ioServer = createServer(app)
const io = new Server(ioServer, {
  cors: {
    origin: 'http://localhost:4321', // Astro port
    methods: ['GET', 'POST']
  }
})

multiHandler(io)

// Start server
const PORT = process.env.PORT || 3000
ioServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})