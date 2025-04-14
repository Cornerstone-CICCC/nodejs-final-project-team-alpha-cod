import { Server, Socket } from 'socket.io'

export const handleSocketEvents = (
  io: Server,
  socket: Socket,
  users: Record<string, string>
) => {
  socket.emit('chat', {
    message: 'Welcome to our amazing chat! Have fun!'
  })

  socket.broadcast.emit('chat', {
    message: `A new user just joined chat`
  })

  // Listening for new updates to chat event
  socket.on('chat', (data) => {
    users[socket.id] = data.username
    io.emit('chat', {
      username: data.username,
      message: data.message
    })
  })

  socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected :(`)
    io.emit('chat', {
      message: `${users[socket.id]} just left chat.`
    })
  })
}