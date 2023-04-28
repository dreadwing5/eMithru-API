const mongoose = require("mongoose");

const ThreadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  topic: {
    type: String,
    enum: ["general", "attendance", "performance", "well-being"],
    required: true,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  closedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Thread", ThreadSchema);
