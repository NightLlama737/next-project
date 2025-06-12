import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('join-chat', (data) => {
    const { senderId, receiverId } = data;
    const roomName = [senderId, receiverId].sort().join('-');
    socket.join(roomName);
  });

  socket.on('send-message', (data) => {
    const { senderId, receiverId, message } = data;
    const roomName = [senderId, receiverId].sort().join('-');
    io.to(roomName).emit('receive-message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});