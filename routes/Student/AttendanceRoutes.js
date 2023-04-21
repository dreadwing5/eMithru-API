const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const Attendance = require("../../models/Attendance");

// Create new attendance record
router.post("/", async (req, res, next) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save(req.body);
    res.status(201).json(attendance);
  } catch (error) {
    console.log("couldn't find");
    next(error);
  }
});

// Get all attendance records
router.get("/", async (req, res, next) => {
  try {
    const attendance = await Attendance.find();
    res.json(attendance.map(Attendance.serialize));
  } catch (error) {
    next(error);
  }
});

// Get attendance record by ID
router.get("/:id", async (req, res, next) => {
  try {
    const attendance = await Attendance.findOne({
      _id: ObjectId(req.params.id),
    });
    if (!attendance) {
      return res.status(404).send();
    }
    res.json(Attendance.serialize(attendance));
  } catch (error) {
    next(error);
  }
});

// Update attendance record by ID
router.put("/:id", async (req, res, next) => {
  try {
    const attendance = await Attendance.findOne({
      _id: ObjectId(req.params.id),
    });
    if (!attendance) {
      return res.status(404).send();
    }
    await Attendance.update({ _id: ObjectId(req.params.id) }, req.body);
    const updatedAttendance = await Attendance.findOne({
      _id: ObjectId(req.params.id),
    });
    res.json(Attendance.serialize(updatedAttendance));
  } catch (error) {
    next(error);
  }
});

// Delete attendance record by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const attendance = await Attendance.findOne({
      _id: ObjectId(req.params.id),
    });
    if (!attendance) {
      return res.status(404).send();
    }
    await Attendance.remove({ _id: ObjectId(req.params.id) });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
