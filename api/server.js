// index.js
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

const db = require("./model");

// Import Routes
require("./route/score.routes")(app);
require("./route/player.routes")(app);
// Attach io to the request object via middleware before the session routes
app.use('/api/sessions', (req, res, next) => {
  req.io = io;  // Attach io instance to the request object
  next();  // Continue to the route handler
});
require("./route/session.routes")(app);
require("./route/gamestate.routes")(app);

// WebSocket connections
const activeSessions = new Map();

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("joinSession", (sessionCode) => {
    socket.join(sessionCode);
    activeSessions.set(sessionCode, socket);
  });

  socket.on("disconnect", () => {
    console.log("WebSocket disconnected");
  });
});

// Helper to notify players in a session
const notifyPlayersInSession = (sessionCode, message) => {
  io.to(sessionCode).emit("gameUpdate", message);
};

module.exports = { notifyPlayersInSession };

// Database connection and server start
db.mongoose.connect(db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to the database");
  server.listen(8080, () => {
    console.log("Server is running on port 8080");
  });
}).catch(err => console.log("Failed to connect to the database", err));
