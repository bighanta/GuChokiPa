const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.scores = require("./score.model.js")(mongoose);
db.players = require("./player.model.js")(mongoose);
db.sessions = require("./session.model.js")(mongoose);
db.gamestates = require("./gamestate.model.js")(mongoose);

module.exports = db;

