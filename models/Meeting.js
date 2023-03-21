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
  start_time: {
    type: String,
    required: true,
  },
  end_time: {
    type: String,
    required: true,
  },
  type_of_meeting: {
    type: String,
    required: true,
  },
});

const Meeting = mongoose.model("meeting", meetingSchema);

module.exports = Meeting;
