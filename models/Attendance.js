// const { ObjectId } = require("mongodb");
// import { mongoose } from "mongoose";
const mongoose = require("mongoose");
const attendanceSchema = new mongoose.Schema({
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

// const attendanceCollection = {
//   name: "attendance",
//   schema: attendanceSchema,
//   indexes: [{ key: { subjectCode: 1, semester: 1, year: 1 }, unique: true }],
//   methods: {
//     serialize: function (attendance) {
//       return {
//         id: attendance._id.toString(),
//         subjectCode: attendance.subjectCode,
//         subjectName: attendance.subjectName,
//         semester: attendance.semester,
//         year: attendance.year,
//         months: attendance.months.map((month) => ({
//           month: month.month,
//           classesTaken: month.classesTaken,
//           classesAttended: month.classesAttended,
//         })),
//       };
//     },
//     deserialize: function (attendance) {
//       return {
//         _id: ObjectId(attendance.id),
//         subjectCode: attendance.subjectCode,
//         subjectName: attendance.subjectName,
//         semester: attendance.semester,
//         year: attendance.year,
//         months: attendance.months.map((month) => ({
//           month: month.month,
//           classesTaken: month.classesTaken,
//           classesAttended: month.classesAttended,
//         })),
//       };
//     },
//   },
// };

// module.exports = attendanceCollection;

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
