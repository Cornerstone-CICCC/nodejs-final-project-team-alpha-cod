import { Server } from "socket.io";
import { handleMultiEvents } from "../controllers/multi.controller";

export const multiHandler = (io: Server) => {
  
    
  io.on('connection', (socket) => {
    console.log(`${socket.id} has joined`)
    handleMultiEvents(io, socket)
  })
}