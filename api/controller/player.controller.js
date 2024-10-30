// controllers/player.controller.js
const db = require("../model");
const Player = db.players;

// Create and Save a new Player
exports.create = (req, res) => {
  if (!req.body.player_id || !req.body.name) {
    res.status(400).send({ message: "Player ID and Name are required!" });
    return;
  }

  // Create a Player
  const player = new Player({
    player_id: req.body.player_id,
    name: req.body.name,
    age: req.body.age || null,
    team: req.body.team || null,
    position: req.body.position || null
  });

  // Save Player in the database
  player
    .save()
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "An error occurred while creating the Player."
      });
    });
};

// Retrieve all Players
exports.findAll = (req, res) => {
  Player.find()
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving players."
      });
    });
};

// Find a single Player by ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Player.findById(id)
    .then(data => {
      if (!data) res.status(404).send({ message: "Player not found with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving Player with id=" + id });
    });
};

// Update a Player by ID
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update cannot be empty!" });
  }

  const id = req.params.id;

  Player.findByIdAndUpdate(id, req.body, { new: true })
    .then(data => {
      if (!data) res.status(404).send({ message: `Cannot update Player with id=${id}. Player not found!` });
      else res.send({ message: "Player updated successfully." });
    })
    .catch(err => {
      res.status(500).send({ message: "Error updating Player with id=" + id });
    });
};

// Delete a Player by ID
exports.delete = (req, res) => {
  const id = req.params.id;

  Player.findByIdAndRemove(id)
    .then(data => {
      if (!data) res.status(404).send({ message: `Cannot delete Player with id=${id}. Player not found!` });
      else res.send({ message: "Player deleted successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: "Could not delete Player with id=" + id });
    });
};

// Delete all Players
exports.deleteAll = (req, res) => {
  Player.deleteMany({})
    .then(data => {
      res.send({ message: `${data.deletedCount} players were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "An error occurred while deleting all players."
      });
    });
};

