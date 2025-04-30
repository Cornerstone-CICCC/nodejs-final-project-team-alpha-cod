import { Server, Socket } from 'socket.io'

export const handleMultiEvents = (
  io: Server,
  socket: Socket
) => {
  socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected...`)
  })
}