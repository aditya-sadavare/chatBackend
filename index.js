// server.js

import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  socket.on("message", ({ room, msg, username, socketId }) => {
    io.to(room).emit("recmsg", { msg, username, socketId });
  });

  socket.on("joinroom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Hello");
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
