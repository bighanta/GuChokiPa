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

// Attach io to the request object via middleware before the session routes
app.use('/api/sessions', (req, res, next) => {
  req.io = io;  // Attach io instance to the request object
  next();  // Continue to the route handler
});
require("./route/session.routes")(app);

// In-memory storage for game sessions
const gameSessions = new Map();

io.on("connection", (socket) => {
  console.log("New WebSocket connection:", socket.id);

  socket.on("joinGame", ({ sessionCode, playerName }) => {
    socket.join(sessionCode);

    // Initialize session if it doesn’t exist
    if (!gameSessions.has(sessionCode)) {
      gameSessions.set(sessionCode, {
        players: {},
        scores: { player1: 0, player2: 0 },
        moves: {},
      });
    }

    // Add player to session with their name
    const game = gameSessions.get(sessionCode);
    const playerNum = Object.keys(game.players).length + 1;
    console.log("Join game: ", game);

    if (playerNum > 2) {
      socket.emit("sessionFull", "Session is already full.");
      return;
    }

    game.players[socket.id] = { playerName, playerNum };  // Store player name and number
    socket.emit("joinedSession", `Player ${playerNum} (${playerName}) joined session: ${sessionCode}`);

    // Notify both players when both have joined
    if (Object.keys(game.players).length === 2) {
      const [player1Id, player2Id] = Object.keys(game.players);
      const player1Name = game.players[player1Id].playerName;
      const player2Name = game.players[player2Id].playerName;

      // Emit both player names to both players
      io.to(sessionCode).emit("gameStart", {
        message: "Both players connected. Game starting!",
        player1Name,
        player2Name
      });
    }
  });

  socket.on("playerMove", ({ move, sessionCode }) => {
    const game = gameSessions.get(sessionCode);
    if (!game) return;
    console.log("playerMove: ", game);

    // Store move for the player
    game.moves[socket.id] = move;

    // Get the player name from the session
    const playerName = game.players[socket.id].playerName;

    // Check if both players have made their moves
    if (Object.keys(game.moves).length === 2) {
      const [player1Id, player2Id] = Object.keys(game.players);
      const move1 = game.moves[player1Id];
      const move2 = game.moves[player2Id];

      // Get the player names
      const player1Name = game.players[player1Id].playerName;
      const player2Name = game.players[player2Id].playerName;

      // Determine outcome of the round
      const result = determineRoundOutcome(move1, move2);
      let roundResultMessage;
      if (result === "draw") {
        roundResultMessage = "Draw!";
      } else {
        const winner = result === "player1" ? player1Name : player2Name;
        game.scores[result] += 1;
        roundResultMessage = `${winner} wins the round!`;
      }

      // Emit round outcome and updated scores to both players, including player names
      io.to(sessionCode).emit("roundOutcome", {
        result: roundResultMessage,
        playerScore: game.scores.player1,
        opponentScore: game.scores.player2,
        player1Name,
        player2Name
      });

      // Reset moves for the next round
      game.moves = {};

      // Check for game over condition
      if (game.scores.player1 >= 3 || game.scores.player2 >= 3) {
        const gameWinner = game.scores.player1 >= 3 ? player1Name : player2Name;
        io.to(sessionCode).emit("gameOver", {
          winner: gameWinner,
          player1Name,
          player2Name
        });
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

