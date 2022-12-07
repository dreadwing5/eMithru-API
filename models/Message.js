const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String,
  },
  text: {
    type: String,
  },
  status: {
    type: String,
    enum: ["read", "unread"],
    default: "unread",
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
