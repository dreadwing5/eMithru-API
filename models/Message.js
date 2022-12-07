const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "conversations",
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  body: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  date: {
    type: String,
    default: Date.now,
  },
});

const Message = mongoose.model("messages", messageSchema);

module.exports = Message;
