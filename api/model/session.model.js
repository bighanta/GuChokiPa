// models/session.model.js
module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      session_code: {
        type: String,
        required: true,
        unique: true,
        match: /^\d{6}$/ // Enforces a 6-digit code pattern
      },
      players: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Player" } // References Player documents
      ]
    },
    { timestamps: true }
  );

  // Convert MongoDB _id to id in JSON output
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Session = mongoose.model("Session", schema);
  return Session;
};

