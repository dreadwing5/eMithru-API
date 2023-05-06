import Attendance from "../../models/attendanceModel";
import catchAsync from "../../utils/catchAsync";
import { createNewThread } from "../../controllers/threadController";

const checkMinimumAttendance = async (attendanceData) => {
  const { userID, semester, month, subjects } = attendanceData;

  const totalClasses = subjects.reduce(
    (acc, subject) => acc + subject.totalClasses,
    0
  );
  const attendedClasses = subjects.reduce(
    (acc, subject) => acc + subject.attendedClasses,
    0
  );

  const overallAttendance = (attendedClasses / totalClasses) * 100;

  if (overallAttendance < MINIMUM_ATTENDANCE_CRITERIA) {
    // Get the mentor of the student
    const mentor = await getMentor(userID);

    // Create a thread with the student and mentor
    await createNewThread({
      author: "system",
      participants: [userID, mentor],
      title: `Attendance issue for ${month} in semester ${semester}`,
      topic: "attendance",
    });

    // Send an email to the mentor with the attendance report
    sendAttendanceReportToMentor(mentor, attendanceData);
  }

  return overallAttendance;
};

export const submitAttendanceData = catchAsync(async (req, res, next) => {
  const attendanceData = req.body;
  attendanceData.userID = req.user._id;
  attendanceData.overallAttendance = await checkMinimumAttendance(
    attendanceData
  );

  const attendance = await Attendance.create(attendanceData);
  res.status(201).json({
    status: "success",
    data: {
      attendance,
    },
  });
});
