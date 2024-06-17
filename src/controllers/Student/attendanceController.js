import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import ThreadService from "../../services/threadService.js";
import logger from "../../utils/logger.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

const threadService = new ThreadService();

const MINIMUM_ATTENDANCE_CRITERIA = 75;
const BASE_URL = process.env.PYTHON_API;

const sendAttendanceReport = async (attendanceData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/generate_attendance_report`,
      {
        attendanceData,
      }
    );

    if (response.status !== 200) {
      throw new Error(`Error sending attendance report: ${response.data}`);
    }
  } catch (error) {
    logger.error("Error creating user", {
      error: error.message,
      stack: error.stack,
    });
    throw new Error(`Error sending attendance report: ${error}`);
  }
};

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
    try {
      // Send attendance report to the API
      await sendAttendanceReport(attendanceData);

      // Get the mentor of the student
      // const mentor = await getMentor(userID);
      const mentor = "644a733c18d4e8d70b7bd5b6"; // Use some hard coded value

      // Create a thread with the student and mentor
      await threadService.createThread(
        mentor,
        [userId, mentor],
        `Attendance issue for ${month} in semester ${semester}`,
        "attendance"
      );

      logger.info("SENDING REPORT");
    } catch (error) {
      console.error("Error in checkMinimumAttendance:", error);
      throw error;
    }
  }

  return overallAttendance;
};

export const submitAttendanceData = async (req, res) => {
  try {
    const attendanceData = req.body;
    attendanceData.userId = req.params.userId;

    attendanceData.overallAttendance = await checkMinimumAttendance(
      attendanceData
    );

    const { data, error } = await supabase
      .from("attendances")
      .insert(attendanceData)
      .single();

    if (error) {
      throw new Error(`Error creating attendance record: ${error.message}`);
    }

    res.status(201).json({
      status: "success",
      data: {
        attendance: data,
      },
    });
  } catch (error) {
    console.error("Error in submitAttendanceData:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// This is for testing purposes, we want to quickly delete data
export const deleteAllAttendance = async (req, res) => {
  const userId = req.params.userId;

  const { data, error } = await supabase
    .from("attendances")
    .delete()
    .eq("user_id", userId);

  if (error) {
    return res
      .status(400)
      .json({ message: "No attendance records found for user ID" });
  }

  res
    .status(204)
    .json({ message: "All attendance records deleted successfully" });
};
