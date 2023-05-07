import { Router } from "express";

import Meeting from "../models/Meeting.js";
// import Mentorship from "../models/Mentorship.js";

const router = Router();

router.post("/", async (req, res) => {
  const { title, location, start, end, type, recipients } = req.body;
  console.log(title);
  const newMeeting = {
    title,
    location,
    start,
    end,
    type,
    recipients,
  };

  // get {list of mentees of a mentor}

  const meeting = new Meeting(newMeeting);
  try {
    const savedMeeting = await meeting.save();
    res.status(200).json(savedMeeting);
    console.log(savedMeeting);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const meetingsData = await Meeting.find();
    res.status(200).json(meetingsData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:meetId", async (req, res) => {
  const { meetId } = req.params;
  try {
    const deletedMeeting = await Meeting.findByIdAndDelete(meetId);

    if (!deletedMeeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res
      .status(200)
      .json({ message: "Meeting deleted successfully", deletedMeeting });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
