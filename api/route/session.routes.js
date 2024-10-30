// routes/session.routes.js
module.exports = app => {
  const sessions = require("../controller/session.controller.js");

  const router = require("express").Router();

  // Create a new session
  router.post("/", sessions.create);

  // Retrieve a session by session_code
  router.get("/:session_code", sessions.findByCode);

  // Add a player to a session
  router.post("/:session_code/addPlayer", sessions.addPlayer);

  app.use("/api/sessions", router);
};

