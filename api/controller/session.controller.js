// controllers/session.controller.js
const db = require("../model");
const Session = db.sessions;
const Player = db.players;

// Helper function to generate a random 6-digit code
const generateSessionCode = async () => {
  let code;
  let sessionExists = true;

  while (sessionExists) {
    code = Math.floor(100000 + Math.random() * 900000).toString(); // Random 6-digit code
    sessionExists = await Session.findOne({ session_code: code });
  }

  return code;
};

// Create and Save a new Session
exports.create = async (req, res) => {
  try {
    const code = await generateSessionCode();

    const session = new Session({
      session_code: code,
      players: []  // Initialize with an empty list of players
    });

    const data = await session.save();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "An error occurred while creating the Session."
    });
  }
};

// Retrieve a session by its session_code
exports.findByCode = (req, res) => {
  const sessionCode = req.params.session_code;

  Session.findOne({ session_code: sessionCode })
    .populate("players")  // Populate player details
    .then(data => {
      if (!data) {
        res.status(404).send({ message: "Session not found with code " + sessionCode });
      } else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving session with code=" + sessionCode
      });
    });
};

// Add a player to a session
exports.addPlayer = (req, res) => {
  const sessionCode = req.params.session_code;
  const playerId = req.body.player_id;

  Session.findOneAndUpdate(
    { session_code: sessionCode },
    { $addToSet: { players: playerId } },  // Use addToSet to avoid duplicate entries
    { new: true }
  )
    .populate("players")
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Session not found with code ${sessionCode}` });
      } else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error adding player to session."
      });
    });
};

