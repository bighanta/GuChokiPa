// controllers/gamestate.controller.js
const db = require("../model");
const GameState = db.gamestates;

exports.createOrUpdate = async (req, res) => {
  const sessionId = req.body.session_id;
  const playerChoices = req.body.playerChoices;
  const round = req.body.round;

  if (!sessionId || !playerChoices || !round) {
    res.status(400).send({ message: "Session ID, player choices, and round are required!" });
    return;
  }

  try {
    const gameState = await GameState.findOneAndUpdate(
      { session_id: sessionId },
      { playerChoices, round },
      { upsert: true, new: true }
    );

    res.send(gameState);
  } catch (err) {
    res.status(500).send({
      message: err.message || "An error occurred while saving the game state."
    });
  }
};

// Retrieve the game state by session_id
exports.findBySessionId = (req, res) => {
  const sessionId = req.params.session_id;

  GameState.findOne({ session_id: sessionId })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: "No game state found for session " + sessionId });
      } else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error retrieving game state for session " + sessionId
      });
    });
};
// controllers/gamestate.controller.js
exports.updateChoicesAndScore = async (req, res) => {
  const sessionId = req.params.session_id;
  const { playerId, choice } = req.body;

  try {
    const gameState = await GameState.findOne({ session_id: sessionId });
    if (!gameState) {
      return res.status(404).send({ message: "Session not found." });
    }

    // Update the choice for the player
    gameState.playerChoices.set(playerId, choice);

    // Check if both players have made choices to proceed with scoring
    const choices = Array.from(gameState.playerChoices.values());
    if (choices.length === 2) {
      const [choice1, choice2] = choices;
      const playerIds = Array.from(gameState.playerChoices.keys());

      if (choice1 === choice2) {
        gameState.status = "tied";
      } else if (
        (choice1 === "rock" && choice2 === "scissors") ||
        (choice1 === "scissors" && choice2 === "paper") ||
        (choice1 === "paper" && choice2 === "rock")
      ) {
        gameState.scores.set(playerIds[0], (gameState.scores.get(playerIds[0]) || 0) + 1);
      } else {
        gameState.scores.set(playerIds[1], (gameState.scores.get(playerIds[1]) || 0) + 1);
      }

      gameState.round += 1;
      gameState.playerChoices.clear();
    }

    await gameState.save();
    res.send(gameState);
  } catch (err) {
    res.status(500).send({
      message: err.message || "An error occurred while updating player choices and scores."
    });
  }
};

