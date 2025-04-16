import { Server, Socket } from 'socket.io'

export const handleMultiEvents = (
  io: Server,
  socket: Socket,
  users: Record<string, string>
) => {
  socket.emit('connect', {
    message: 'Welcome to our amazing chat! Have fun!'
  })

  // Listening for new updates to chat event
  socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected :(`)
  })
}