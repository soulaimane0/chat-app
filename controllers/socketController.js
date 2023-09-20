// Socket io controller
const connectedUsers = [];

export function initializeSocketIo(io) {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinUser', (username) => {
      socket.username = username;
      connectedUsers.push(username);
      io.emit('connectedUsers', connectedUsers);
      socket.broadcast.emit('update', `${username} has joined the chat`);
    });
    socket.on('exitUser', (username) => {
      socket.broadcast.emit('update', `${username} has left the chat`);
    });
    socket.on('chat-message', (message) => {
      socket.broadcast.emit('chat-message', message);
    });

    socket.on('disconnect', () => {
      if (socket.username) {
        const index = connectedUsers.indexOf(socket.username);
        if (index !== -1) {
          connectedUsers.splice(index, 1);
          io.emit('connectedUsers', connectedUsers);
        }
      }
      console.log('A user disconnected');
    });
  });
}
