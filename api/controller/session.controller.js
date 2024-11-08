// controllers/session.controller.js
const db = require('../model');
const Session = db.sessions;
const { notifyPlayersInSession } = require('../model/index.js');

function determineWinner(move1, move2) {
  if (move1 === move2) return "draw";
  if (
    (move1 === "rock" && move2 === "scissors") ||
    (move1 === "scissors" && move2 === "paper") ||
    (move1 === "paper" && move2 === "rock")
  ) {
    return "player1";
  }
  return "player2";
}

// Create a session
exports.createSession = (req, res) => {
  const { playerName } = req.body;
  const sessionCode = Math.floor(100000 + Math.random() * 900000).toString();
  const session = new Session({ session_code: sessionCode, players: [playerName] });

  session.save()
    .then((data) => res.status(201).json({ code: sessionCode }))
    .catch(err => res.status(500).send({ message: err.message }));

  console.log(session);
};

// session.controller.js
exports.joinSession = async (req, res) => {
  try {
    const sessionCode = req.params.session_code;
    const playerName = req.body.playerName || "Player2";

    // Fetch the session from the database
    let session = await Session.findOne({ session_code: sessionCode });

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // Check if the session is full
    if (session.players.length >= 2) {
      return res.status(400).json({ success: false, message: "Session is full" });
    }

    // Add the new player to the session
    session.players.push(playerName);
    await session.save();

    // Notify all players in the session room that the session is full
    req.io.to(sessionCode).emit("session_full", { message: "Both players are connected. Starting game." });

    res.status(200).json({ success: true, message: "Joined session", session });
  } catch (error) {
    console.error("Error joining session:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Process a move
exports.processMove = (req, res) => {
  const sessionCode = req.params.session_code;
  const { playerName, move } = req.body;

  if (!["rock", "paper", "scissors"].includes(move)) {
    return res.status(400).send({ message: "Invalid move" });
  }

  Session.findOne({ session_code: sessionCode })
    .then((session) => {
      if (!session) return res.status(404).send({ message: "Session not found" });

      session.moves[playerName] = move;

      if (Object.keys(session.moves).length === 2) {
        const [player1, player2] = session.players;
        const result = determineWinner(session.moves[player1], session.moves[player2]);

        if (result === "player1") session.scores[player1] += 1;
        else if (result === "player2") session.scores[player2] += 1;

        const roundResult = { result, moves: session.moves, scores: session.scores };
        let winner = null;

        if (session.scores[player1] >= 3) winner = player1;
        else if (session.scores[player2] >= 3) winner = player2;

        notifyPlayersInSession(sessionCode, { event: "roundResult", ...roundResult, winner });
        session.moves = {};

        if (winner) session.isActive = false;

        return session.save().then(() => res.send(roundResult));
      } else {
        return session.save().then(() => res.send({ message: "Move registered" }));
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
};

