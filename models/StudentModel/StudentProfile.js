const mongoose = require("mongoose");

const mentorHistorySchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

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
  mentorHistory: [mentorHistorySchema],
  currentMentors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

studentProfileSchema.path("currentMentors").validate(function (mentors) {
  return mentors.length <= 2;
}, "A maximum of 2 mentors can be assigned to a student.");
module.exports = mongoose.model("StudentProfile", studentProfileSchema);
