const db = require("../model");
const Score = db.scores;

// Create and Save a new Score
exports.create = (req, res) => {
  // Validate request
  if (!req.body.player_id) {
    res.status(400).send({ message: "Player ID cannot be empty!" });
    return;
  }

  // Create a Score
  const score = new Score({
    player_id: req.body.player_id,
    player_name: req.body.player_name || "test",
    score: req.body.score || 0
  });

  // Save Score in the database
  score
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "An error occurred while creating the score."
      });
    });
};

// Retrieve all score from the database
exports.findAll = (req, res) => {
  const player_id = req.query.player_id;
  const condition = player_id ? { player_id: { $regex: new RegExp(player_id), $options: "i" } } : {};

  Score.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "An error occurred while retrieving score."
      });
    });
};

// Find a single Score with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Score.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Score not found with id ${id}` });
      } else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({ message: `Error retrieving score with id=${id}` });
    });
};

// Find the latest score for a given player by name
exports.findLatestScore = (req, res) => {
  const playerName = req.params.player_name;

  Score.findOne({ player_name: playerName })
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `No scores found for player ${playerName}` });
      } else {
        res.send(data); // Return the latest score record
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || `Error retrieving latest score for player ${playerName}`
      });
    });
};

// Update a Score by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!"
    });
  }

  const id = req.params.id;

  Score.findByIdAndUpdate(id, req.body, { new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update score with id=${id}. Score was not found!`
        });
      } else {
        res.send({ message: "Score was updated successfully." });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating score with id=${id}`
      });
    });
};

// Delete a Score with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Score.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete score with id=${id}. Score was not found!`
        });
      } else {
        res.send({ message: "Score was deleted successfully!" });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Could not delete score with id=${id}`
      });
    });
};

// Delete all score from the database
exports.deleteAll = (req, res) => {
  Score.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} score were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "An error occurred while deleting all score."
      });
    });
};

