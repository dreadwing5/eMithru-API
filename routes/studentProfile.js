const router = require("express").Router();
const StudentProfile = require("../models/StudentModel/StudentProfile");

// Create a new student profile
router.post("/", async (req, res) => {
  try {
    const studentProfile = new StudentProfile(req.body);
    const savedStudentProfile = await studentProfile.save();
    res.status(201).json(savedStudentProfile);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get all student profiles
router.get("/", async (req, res) => {
  try {
    const studentProfiles = await StudentProfile.find();
    res.status(200).json(studentProfiles);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get a specific student profile by ID
router.get("/:id", async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findById(req.params.id);
    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found" });
    }
    res.status(200).json(studentProfile);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update a specific student profile by ID
router.patch("/:id", async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found" });
    }
    res.status(200).json(studentProfile);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete a specific student profile by ID
router.delete("/:id", async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findByIdAndDelete(
      req.params.id
    );
    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found" });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
