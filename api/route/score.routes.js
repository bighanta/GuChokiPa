module.exports = app => {
  const score = require("../controller/score.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", score.create);

  // Retrieve all score
  router.get("/", score.findAll);

  // Retrieve a single Tutorial with id
  router.get("/:id", score.findOne);

  // Route to get the latest score of a given player
  router.get("/latest/:player_name", score.findLatestScore);

  // Update a Tutorial with id
  router.put("/:id", score.update);

  // Delete a Tutorial with id
  router.delete("/:id", score.delete);

  // Delete all score
  router.delete("/", score.deleteAll);

  app.use('/api/scores', router);
};
