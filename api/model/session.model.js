// models/session.model.js
module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      session_code: { type: String, required: true, unique: true },
      players: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }
      ]
    },
    { timestamps: true }
  );

  // Custom method to format the JSON output
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Session = mongoose.model("Session", schema);
  return Session;
};
