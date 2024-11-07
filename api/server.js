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

// In-memory storage for game sessions
const gameSessions = new Map();

io.on("connection", (socket) => {
  console.log("New WebSocket connection:", socket.id);

  // Player joining a game session
  socket.on("joinGame", ({ sessionCode }) => {
    socket.join(sessionCode);

    // Initialize session if it doesn’t exist
    if (!gameSessions.has(sessionCode)) {
      gameSessions.set(sessionCode, {
        players: {},
        scores: { player1: 0, player2: 0 },
        moves: {},
      });
    }

    // Add player to session
    const game = gameSessions.get(sessionCode);
    const playerNum = Object.keys(game.players).length + 1;
    if (playerNum > 2) {
      socket.emit("sessionFull", "Session is already full.");
      return;
    }
    game.players[socket.id] = `player${playerNum}`;
    socket.emit("joinedSession", `Player ${playerNum} joined session: ${sessionCode}`);

    // Notify players when both have joined
    if (Object.keys(game.players).length === 2) {
      io.to(sessionCode).emit("gameStart", "Both players connected. Game starting!");
    }
  });

  // Player makes a move
  socket.on("playerMove", ({ move, sessionCode }) => {
    const game = gameSessions.get(sessionCode);
    if (!game) return;

    // Store move for the player
    game.moves[socket.id] = move;

    // Check if both players have made moves
    if (Object.keys(game.moves).length === 2) {
      const [player1Id, player2Id] = Object.keys(game.players);
      const move1 = game.moves[player1Id];
      const move2 = game.moves[player2Id];

      // Determine outcome of the round
      const result = determineRoundOutcome(move1, move2);
      let roundResultMessage;
      if (result === "draw") {
        roundResultMessage = "Draw!";
      } else {
        const winner = result === "player1" ? "Player 1" : "Player 2";
        game.scores[result] += 1;
        roundResultMessage = `${winner} wins the round!`;
      }

      // Emit round outcome and updated scores to both players
      io.to(sessionCode).emit("roundOutcome", {
        result: roundResultMessage,
        playerScore: game.scores.player1,
        opponentScore: game.scores.player2,
      });

      // Reset moves for the next round
      game.moves = {};

      // Check for game over condition
      if (game.scores.player1 >= 5 || game.scores.player2 >= 5) {
        const gameWinner = game.scores.player1 >= 5 ? "Player 1" : "Player 2";
        io.to(sessionCode).emit("gameOver", gameWinner);
        gameSessions.delete(sessionCode);  // Clear session after game over
      }
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("WebSocket disconnected:", socket.id);
    gameSessions.forEach((game, sessionCode) => {
      if (game.players[socket.id]) {
        delete game.players[socket.id];
        if (Object.keys(game.players).length === 0) {
          gameSessions.delete(sessionCode);  // Remove session if both players disconnect
        }
      }
    });
  });
});

// Helper function to determine round outcome
function determineRoundOutcome(move1, move2) {
  if (move1 === move2) return "draw";
  if (
    (move1 === "rock" && move2 === "scissors") ||
    (move1 === "paper" && move2 === "rock") ||
    (move1 === "scissors" && move2 === "paper")
  ) {
    return "player1";
  }
  return "player2";
}

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

