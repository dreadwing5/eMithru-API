const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema({
  usn: {
    type: String,
    unique: true,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  currentSemester: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  personalData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentPersonalData",
    required: true,
  },
});

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
