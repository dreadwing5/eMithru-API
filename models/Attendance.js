const mongoose = require("mongoose");

const { Schema } = mongoose;

const attendanceSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "StudentProfile",
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  subjectName: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  months: {
    type: [
      {
        month: {
          type: Number,
          required: true,
        },
        classesTaken: {
          type: Number,
          required: true,
        },
        classesAttended: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
