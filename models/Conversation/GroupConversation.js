const mongoose = require("mongoose");

const GroupConversationSchema = new mongoose.Schema({
  type: { type: String, enum: ["group"], default: "group" },
  name: { type: String, required: true },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  participants: [
    {
      participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      joinedAt: { type: Date, default: Date.now },
      leftAt: { type: Date },
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
    },
  ],
});

module.exports = mongoose.model("GroupConversation", GroupConversationSchema);
