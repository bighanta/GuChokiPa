// models/gamestate.model.js
module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      session_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true
      },
      round: {
        type: Number,
        default: 1
      },
      playerChoices: {
        type: Map,
        of: String, // Stores each player's choice (rock, paper, or scissors)
        default: {}
      },
      scores: {
        type: Map,
        of: Number, // Tracks each player's score
        default: {}
      },
      status: {
        type: String,
        enum: ["ongoing", "completed", "tied"],
        default: "ongoing"
      }
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const GameState = mongoose.model("GameState", schema);
  return GameState;
};

