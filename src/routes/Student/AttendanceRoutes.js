import { Router } from "express";
import { submitAttendanceData } from "../../controllers/Student/attendanceController.js";

const router = Router();

router.post("/submit", submitAttendanceData);

export default router;
