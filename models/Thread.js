const mongoose = require("mongoose");

const ThreadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  state: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  openDate: {
    type: Date,
    default: Date.now,
  },
  closeDate: {
    type: Date,
    default: null,
  },
  tag: {
    type: String,
    enum: ["general", "attendance", "performance", "mental health"],
    required: true,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
    },
  ],
});

module.exports = mongoose.model("Thread", ThreadSchema);
