// routes/session.routes.js
const session = require("../controller/session.controller");

module.exports = (app) => {
  const router = require("express").Router();

  router.post("/create", session.createSession);
  router.post("/:session_code/join", session.joinSession);
  router.post("/:session_code/move", session.processMove);

  app.use("/api/sessions", router);
};

