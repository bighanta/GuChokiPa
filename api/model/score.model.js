module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      player_name: { type: String, default: "test" },
      score: { type: Number, default: 0 }
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Score = mongoose.model("Score", schema);
  return Score;
};

