import { Router } from "express";
import {
  submitAttendanceData,
  deleteAllAttendance,
} from "../../controllers/Student/attendanceController.js";

const router = Router();

router.route("/:userId").post(submitAttendanceData);
router.route("/:userId").delete(deleteAllAttendance);

export default router;

// API END Point : /api/students/attendance/:userId

// MOCK DATA :
