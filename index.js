import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import path from "path";

const PORT = process.env.PORT || 5000;
const app = express();

// Enable CORS
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const server = createServer(app);

// Set up the Socket.IO server with CORS settings
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  // Handle incoming messages
  socket.on("message", ({ room, msg, username, socketId }) => {
    io.to(room).emit("recmsg", { msg, username, socketId });
  });

  // Handle joining rooms
  socket.on("joinroom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

// Route all other requests to index.html
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
