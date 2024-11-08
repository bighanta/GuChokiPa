module.exports = app => {
  const score = require("../controller/score.controller.js");

  var router = require("express").Router();

  // Route to create or update a score based on player_name
  router.post("/", score.createOrUpdate);

  // Route to retrieve all scores ordered by highest first
  router.get("/", score.findAllOrdered);

  // Route to retrieve a specific score by player_name
  router.get("/:player_name", score.findOne);

  // Route to retrieve the latest score for a specific player by name
  router.get("/player/:player_name/latest", score.findLatestScore);

  // Route to update a score by player_name
  router.put("/player/:player_name", score.update);

  // Route to delete a specific score by player_name
  router.delete("/player/:player_name", score.delete);

  // Route to delete all scores
  router.delete("/", score.deleteAll);

  app.use('/api/scores', router);
};

