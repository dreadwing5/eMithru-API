const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  conversationId: {
    type: String,
  },
  lastMessage: {
    type: String,
  },
  date: {
    type: String,
    default: Date.now,
  },
});

const Conversation = mongoose.model("conversations", conversationSchema);

module.exports = Conversation;
