// model/session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  session_code: {
    type: String,
    required: true,
    unique: true, // Ensure unique session codes
  },
  players: {
    type: [String], // Assuming players are stored as strings (names)
    required: true,
  },
});

module.exports = mongoose.model('Session', sessionSchema);

