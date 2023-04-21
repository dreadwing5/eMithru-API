const router = require("express").Router();
const Meeting = require("../models/Meeting");

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

  const meeting = await new Meeting(newMeeting);
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

module.exports = router;
