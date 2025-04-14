import { Server } from "socket.io";
import { handleSocketEvents } from "../controllers/socket.controller";

export const socketHandler = (io: Server) => {
  // List of clients
  const users: Record<string, string> = {}

  // Socket.io events
  io.on('connection', (socket) => {
    console.log(`${socket.id} has joined`)
    handleSocketEvents(io, socket, users)
  })
}