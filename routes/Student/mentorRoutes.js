// Import necessary modules and models
const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Mentorship = require("../../models/Mentorship");

// API route for creating a new mentorship
router.post("/", async (req, res, next) => {
  try {
    // Get mentor and mentee IDs from request body
    const { mentorId, menteeId, startDate } = req.body;

    // Find mentor and mentee by their IDs
    const mentor = await User.findById(mentorId);
    const mentee = await User.findById(menteeId);

    // Check if mentor and mentee exist and are of the correct role
    if (!mentor || mentor.role !== "faculty") {
      return res.status(400).json({ message: "Invalid mentor ID" });
    }
    if (!mentee || mentee.role !== "student") {
      return res.status(400).json({ message: "Invalid mentee ID" });
    }

    // Create new mentorship with mentor and mentee IDs and current date as start date
    const mentorship = new Mentorship({
      mentor: mentorId,
      mentee: menteeId,
      startDate,
    });

    // Save mentorship to database
    await mentorship.save();

    // Return success response
    return res.status(201).json({ message: "Mentorship created successfully" });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Export the router
module.exports = router;
