const mongoose = require("mongoose");

const mentorshipSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
});

// Add a validation to limit the number of students per mentor
mentorshipSchema.statics.countMentorships = async function (mentorId) {
  const count = await this.countDocuments({ mentor: mentorId });
  return count;
};

mentorshipSchema.path("mentor").validate(async function (value) {
  const maxStudentsPerMentor = 16;
  const count = await this.model("Mentorship").countMentorships(value);
  return count < maxStudentsPerMentor;
}, "A mentor cannot have more than 16 students.");

module.exports = mongoose.model("Mentorship", mentorshipSchema);
