import { Server, Socket } from 'socket.io'

export const handleSocketEvents = (
  io: Server,
  socket: Socket,
  users: Record<string, string>
) => {
  socket.emit('chat', {
    username: 'System',
    message: 'Welcome to our chat! Have fun!'
  });

  socket.broadcast.emit('chat', {
    username: 'System',
    message: 'A new user just joined the chat.'
  });

  // Listening for new updates to chat event
  socket.on('chat', (data) => {
    users[socket.id] = data.username
    io.emit('chat', {
      username: data.username,
      message: data.message
    })
  })

  socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected :(`); // ← aquí faltaba cerrar correctamente
  
    const username = users[socket.id] || 'A user';
  
    io.emit('chat', {
      username: 'System',
      message: `${username} just left the chat.`
    });
  
    delete users[socket.id]; // ← también recuerda limpiar el registro del usuario
  });
}