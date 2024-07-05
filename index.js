const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 5000; // Port on which the server will run
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://chat-frontend-bay.vercel.app", // Allow access from this origin
    methods: ["GET", "POST"] // Allow GET and POST requests
  }
});

// Middleware to handle CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://chat-frontend-bay.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

// Socket.IO server logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handling room join
  socket.on('joinroom', (roomName) => {
    socket.join(roomName);
    console.log(`User ${socket.id} joined room ${roomName}`);
    io.to(roomName).emit('welcome', `User ${socket.id} joined room ${roomName}`);
  });

  // Handling messages
  socket.on('message', (data) => {
    console.log(`Message from ${data.username}: ${data.msg}`);
    io.to(data.room).emit('recmsg', {
      username: data.username,
      msg: data.msg,
      socketId: socket.id
    });
  });

  // Handling disconnection
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
