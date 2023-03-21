const router = require("express").Router();
const Meeting = require("../models/Meeting");

router.post("/createmeeting", async (req, res) => {
  const { recipient, title, location, start_time, end_time, type_of_meeting } =
    req.body;
  const newMeeting = {
    recipient,
    title,
    location,
    start_time,
    end_time,
    type_of_meeting,
  };

  const meeting = await new Meeting(newMeeting);
  try {
    const savedMeeting = await meeting.save();
    res.status(200).json(savedMeeting);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/meetings", async (req, res) => {
  try {
    const meetingsData = await Meeting.find();
    res.status(200).json(meetingsData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
