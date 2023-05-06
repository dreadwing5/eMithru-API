import Attendance from "../../models/Student/Attendance.js";
import catchAsync from "../../utils/catchAsync.js";
import ThreadService from "../../services/threadService.js";

const threadService = new ThreadService();

const MINIMUM_ATTENDANCE_CRITERIA = 75;

export const checkMinimumAttendance = async (attendanceData) => {
  if (!attendanceData || !attendanceData.subjects) {
    throw new Error("Invalid attendance data provided");
  }

  const { userId, semester, month, subjects } = attendanceData;

  const totalClasses = subjects.reduce(
    (acc, subject) => acc + (subject.totalClasses || 0),
    0
  );
  const attendedClasses = subjects.reduce(
    (acc, subject) => acc + (subject.attendedClasses || 0),
    0
  );

  if (totalClasses === 0) {
    throw new Error("Total classes cannot be zero");
  }

  const overallAttendance = (attendedClasses / totalClasses) * 100;

  if (overallAttendance < MINIMUM_ATTENDANCE_CRITERIA) {
    // Get the mentor of the student
    // const mentor = await getMentor(userID);
    const mentor = "644a733c18d4e8d70b7bd5b6";

    //Use some hard coded value

    // Create a thread with the student and mentor
    await threadService.createThread(
      mentor,
      [userId, mentor],
      `Attendance issue for ${month} in semester ${semester}`,
      "attendance"
    );

    // Send an email to the mentor with the attendance report
    // sendAttendanceReportToMentor(mentor, attendanceData);

    console.log("SENDING REPORT");
  }

  return overallAttendance;
};

//This is for testing purposes, we want to quickly delete data

export const deleteAllAttendance = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  // Use Mongoose to delete all attendance records with the specified user ID
  const result = await Attendance.deleteMany({ userId: userId });

  if (result.deletedCount === 0) {
    return res
      .status(400)
      .json({ message: "No attendance records found for user ID" });
  }

  res
    .status(204)
    .json({ message: "All attendance records deleted successfully" });
});

export const submitAttendanceData = catchAsync(async (req, res, next) => {
  const attendanceData = req.body;
  // attendanceData.userID = req.user._id;//TODO: Whene user is authenticated
  attendanceData.userId = req.params.userId;

  attendanceData.overallAttendance = await checkMinimumAttendance(
    attendanceData
  );
  const attendance = await Attendance.create(attendanceData);
  res.status(201).json({
    status: "success",
    data: {
      attendance,
    },
  }); // Use Mongoose to delete all attendance records with the specified user ID
  // const result = await Attendance.deleteMany({ userId: userId });
});
