// models/player.model.js
module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      player_id: { type: Number, required: true, unique: true },
      name: { type: String, required: true },
    },
    { timestamps: true }
  );

  // Convert MongoDB _id to id in JSON output
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Player = mongoose.model("Player", schema);
  return Player;
};

