const db = require("../model");
const Score = db.scores;

// Create or Update Score
exports.createOrUpdate = async (req, res) => {
  // Validate request
  if (!req.body.player_name) {
    return res.status(400).send({ message: "Player name cannot be empty!" });
  }

  try {
    // Trim the player_name and make it case-insensitive
    const playerName = req.body.player_name.trim().toLowerCase();

    // Check if the player already has a score (case-insensitive)
    const existingScore = await Score.findOne({ player_name: playerName });

    if (existingScore) {
      // Player exists, add to their score
      existingScore.score += req.body.score || 0;
      const updatedScore = await existingScore.save();
      res.send(updatedScore);
    } else {
      // Create a new score for a new player
      const newScore = new Score({
        player_name: playerName,  // Ensure the player name is normalized
        score: req.body.score || 0,
      });
      const savedScore = await newScore.save();
      res.send(savedScore);
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "An error occurred while creating or updating the score.",
    });
  }
};
// Retrieve all scores in descending order by score
exports.findAllOrdered = async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 });
    res.send(scores);
  } catch (err) {
    res.status(500).send({
      message: err.message || "An error occurred while retrieving scores.",
    });
  }
};

// Find a single Score by player_name
exports.findOne = (req, res) => {
  const playerName = req.params.player_name;

  Score.findOne({ player_name: playerName })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Score not found for player ${playerName}` });
      } else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({ message: `Error retrieving score for player=${playerName}` });
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
        message: err.message || `Error retrieving latest score for player ${playerName}`,
      });
    });
};

// Update a Score for a player by player_name
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update cannot be empty!",
    });
  }

  const playerName = req.params.player_name;

  Score.findOneAndUpdate({ player_name: playerName }, req.body, { new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update score for player ${playerName}. Score was not found!`,
        });
      } else {
        res.send({ message: "Score was updated successfully." });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating score for player ${playerName}`,
      });
    });
};

// Delete a Score for a player by player_name
exports.delete = (req, res) => {
  const playerName = req.params.player_name;

  Score.findOneAndRemove({ player_name: playerName })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete score for player ${playerName}. Score was not found!`,
        });
      } else {
        res.send({ message: "Score was deleted successfully!" });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Could not delete score for player ${playerName}`,
      });
    });
};

// Delete all scores from the database
exports.deleteAll = (req, res) => {
  Score.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} scores were deleted successfully!`,
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "An error occurred while deleting all scores.",
      });
    });
};

