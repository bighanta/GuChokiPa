// controllers/session.controller.js
const db = require("../model");
const Session = db.sessions;

// Function to generate a unique session code
const generateSessionCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
};

// Create and Save a new Session
exports.create = (req, res) => {
  // Validate request
  if (!req.body.playerName) {
    return res.status(400).send({ message: "Player name cannot be empty!" });
  }

  // Create a new session
  const sessionCode = generateSessionCode(); // Generate a new session code
  const session = new Session({
    session_code: sessionCode,
    players: [req.body.playerName], // Store player name in the session
  });

  // Save session in the database
  session
    .save()
    .then(data => {
      res.status(201).send({ code: sessionCode }); // Respond with the generated session code
    })
    .catch(err => {
      console.error('Error creating session:', err);
      res.status(500).send({
        message: err.message || "An error occurred while creating the session."
      });
    });
};

// Retrieve a session by its session_code
exports.findByCode = (req, res) => {
  const sessionCode = req.params.session_code; // Extract session code from request parameters

  Session.findOne({ session_code: sessionCode })
    .populate("players") // Populate players field
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: `Session not found with code ${sessionCode}` });
      }
      res.send(data); // Send the found session as a response
    })
    .catch(err => {
      console.error('Error retrieving session:', err);
      res.status(500).send({
        message: err.message || `Error retrieving session with code=${sessionCode}`
      });
    });
};

// Add a player to a session
exports.addPlayer = (req, res) => {
  const sessionCode = req.params.session_code; // Get session code from request parameters
  const playerId = req.body.player_id; // Get player_id from request body

  // Validate request
  if (!playerId) {
    return res.status(400).send({ message: "Player ID cannot be empty!" });
  }

  Session.findOneAndUpdate(
    { session_code: sessionCode },
    { $addToSet: { players: playerId } }, // Use addToSet to avoid duplicates
    { new: true }
  )
    .populate("players")
    .then(data => {
      if (!data) {
        return res.status(404).send({ message: `Session not found with code ${sessionCode}` });
      }
      res.send(data); // Respond with the updated session
    })
    .catch(err => {
      console.error('Error adding player to session:', err);
      res.status(500).send({
        message: err.message || "Error adding player to session."
      });
    });
};

