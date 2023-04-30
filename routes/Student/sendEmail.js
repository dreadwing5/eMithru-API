import nodemailer from "nodemailer";
import Attendance from "./models/Attendance.js";
import User from "./models/User.js";
import Mentorship from "./models/Mentorship.js";
import cron from "node-cron";

const getOverallAttendance = () => {
  const attended = attendanceData.reduce((total, subject) => {
    const attended = subject.months.reduce(
      (total, month) => total + month.classesAttended,
      0
    );
    return total + attended;
  }, 0);
  const taken = attendanceData.reduce((total, subject) => {
    const taken = subject.months.reduce(
      (total, month) => total + month.classesTaken,
      0
    );
    return total + taken;
  }, 0);
  const percentage = ((attended / taken) * 100).toFixed(2);
  return `${attended}/${taken} (${percentage}%)`;
};

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-password",
  },
});

// Function to send email to student and mentor
const sendAttendanceNotification = async (attendanceId) => {
  try {
    // Get attendance data from database
    const attendance = await Attendance.findById(attendanceId);

    // Calculate overall attendance percentage
    const overallAttendance = parseFloat(
      getOverallAttendance(attendance).split("(")[1].split("%")[0]
    );

    // If attendance is less than 75%, send email to student and mentor
    if (overallAttendance < 75) {
      // Find student's email from User model
      const student = await User.findById(attendance.student);
      const studentEmail = student.email;

      // Find mentor's email from Mentorship model
      const mentorship = await Mentorship.findOne({
        student: attendance.student,
      });
      const mentor = await User.findById(mentorship.mentor);
      const mentorEmail = mentor.email;

      // Send email to student and mentor
      const mailOptions = {
        from: "your-email@gmail.com",
        to: [studentEmail, mentorEmail],
        subject: "Attendance Notification",
        text: `Your attendance for ${attendance.subjectName} is below 75%. Please attend classes regularly.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    }
  } catch (error) {
    console.log("Error sending attendance notification:", error);
  }
};

// Set up cron job to check attendance every 5 minutes

cron.schedule("*/5 * * * *", async () => {
  try {
    // Get all attendance records from database
    const attendanceRecords = await Attendance.find();

    // Send attendance notification for each record
    for (const attendance of attendanceRecords) {
      await sendAttendanceNotification(attendance._id);
    }
  } catch (error) {
    console.log("Error checking attendance:", error);
  }
});
