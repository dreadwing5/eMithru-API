const mongoose = require("mongoose");

const PrivateConversationSchema = new mongoose.Schema({
  type: { type: String, enum: ["private"], default: "private" },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
    },
  ],
});

module.exports = mongoose.model(
  "PrivateConversation",
  PrivateConversationSchema
);
