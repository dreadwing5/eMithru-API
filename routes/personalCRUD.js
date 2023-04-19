const router = require("express").Router();
const StudentPersonalData = require("../models/StudentModel/StudentPersonalData");

// Create a new personal data record
router.post("/", async (req, res) => {
  try {
    const personalData = new StudentPersonalData(req.body);
    const savedPersonalData = await personalData.save();
    res.status(201).json(savedPersonalData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all personal data records
router.get("/", async (req, res) => {
  try {
    const personalData = await StudentPersonalData.find();
    res.status(200).json(personalData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a specific personal data record by ID
router.get("/:id", async (req, res) => {
  try {
    const personalData = await StudentPersonalData.findById(req.params.id);
    if (!personalData) {
      return res.status(404).json({ message: "Personal data not found" });
    }
    res.status(200).json(personalData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a specific personal data record by ID
router.patch("/:id", async (req, res) => {
  try {
    const personalData = await StudentPersonalData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!personalData) {
      return res.status(404).json({ message: "Personal data not found" });
    }
    res.status(200).json(personalData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a specific personal data record by ID
router.delete("/:id", async (req, res) => {
  try {
    const personalData = await StudentPersonalData.findByIdAndDelete(
      req.params.id
    );
    if (!personalData) {
      return res.status(404).json({ message: "Personal data not found" });
    }
    res.status(204).json();
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
