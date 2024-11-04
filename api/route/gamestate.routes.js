// routes/gamestate.routes.js
module.exports = app => {
  const gamestates = require("../controller/gamestate.controller.js");

  const router = require("express").Router();

  // Create or update the game state for a session
  router.post("/", gamestates.createOrUpdate);

  // Retrieve game state by session_id
  router.get("/:session_id", gamestates.findBySessionId);

  // Update player choices and calculate scores
  router.post("/:session_id/choices", gamestates.updateChoicesAndScore);

  app.use("/api/gamestates", router);
};

