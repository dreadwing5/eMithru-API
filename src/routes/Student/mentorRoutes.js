// Import necessary modules and models
import { Router } from "express";
import User from "../../models/User.js";
import Mentorship from "../../models/Mentorship.js";

const router = Router();

// API route for creating a new mentorship
router.post("/", async (req, res, next) => {
  try {
    // Get mentor and mentee IDs from request body
    const { mentorId, menteeId, startDate } = req.body;

    // Find mentor and mentee by their IDs, and populate the 'role' field
    const mentor = await User.findById(mentorId).populate("role");
    const mentee = await User.findById(menteeId).populate("role");

    console.log(mentee, mentor);

    // Check if mentor and mentee exist and have the correct role
    if (!mentor || !mentor.role || mentor.role.name !== "faculty") {
      return res.status(400).json({ message: "Invalid mentor ID" });
    }

    if (!mentee || !mentee.role || mentee.role.name !== "student") {
      return res.status(400).json({ message: "Invalid mentee ID" });
    }

    // Create new mentorship with mentor and mentee IDs and current date as start date
    const mentorship = new Mentorship({
      mentorId,
      menteeId,
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

// API route for finding the mentor of a mentee
router.get("/:menteeId", async (req, res, next) => {
  try {
    const { menteeId } = req.params;

    const mentorship = await Mentorship.findOne({ menteeId });

    if (!mentorship) {
      return res.status(404).json({ message: "Mentorship not found" });
    }

    const mentor = await User.findById(mentorship.mentorId);

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    return res.status(200).json({ mentor });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/:mentorId/mentees", async (req, res, next) => {
  try {
    // Get mentor ID from request parameters
    const { mentorId } = req.params;

    // Find all mentorships where the mentor is the specified mentor ID
    const mentorships = await Mentorship.find({ mentor: mentorId });

    // If no mentorships are found, return error response
    if (!mentorships || mentorships.length === 0) {
      return res.status(404).json({ message: "Mentorship not found" });
    }

    // Create an array of mentee IDs from the mentorships
    const menteeIds = mentorships.map((mentorship) => mentorship.mentee);

    // Find all mentees with IDs in the menteeIds array
    const mentees = await User.find({
      _id: { $in: menteeIds },
      role: "student",
    });

    // Return success response with mentees data
    return res.status(200).json({ mentees });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// API route for finding all mentorships
router.get("/", async (req, res, next) => {
  try {
    // Find all mentorships in the database
    const mentorships = await Mentorship.find();

    // Return success response with mentorships data
    return res.status(200).json({ mentorships });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Export the router
export default router;
