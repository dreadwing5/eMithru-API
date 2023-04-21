const mongoose = require("mongoose");
const meetingSchema = new mongoose.Schema({
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Meeting = mongoose.model("meeting", meetingSchema);

module.exports = Meeting;
