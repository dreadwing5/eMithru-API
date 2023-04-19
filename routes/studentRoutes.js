const express = require("express");

const router = express.Router();
const studentController = require("../controllers/Student/profileController");

// POST /api/v1/students
router.post("/profile", studentController.createStudentProfile);

// GET /api/v1/students/:id
router.get("/profile/:id", studentController.getStudentProfileById);

// PATCH /api/v1/students/:id
// router.patch("/:id", studentController.updateStudentProfileById);

// DELETE /api/v1/students/:id
// router.delete("/:id", studentController.deleteStudentProfileById);

module.exports = router;
