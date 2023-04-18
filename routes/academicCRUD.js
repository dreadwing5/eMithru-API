const express = require("express");
const router = express.Router();
const Academics = require("../models/StudentModel/Academic");

const getAcademic = async (req, res) => {
  try {
    const academic = await Academics.findOne({ _id: req.params.id });
    if (!academic) {
      return res.status(404).json({ error: "Academic details not found" });
    }
    res.json(academic);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Get all Academics
router.get("/", async (req, res) => {
  try {
    const academics = await Academics.find();
    res.json(academics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one Academic
router.get("/:id", getAcademic, (req, res) => {
  res.json(res.academic);
});

// Create one Academic
router.post("/", async (req, res) => {
  const academic = new Academics({
    sslc: {
      school: req.body.sslc.school,
      percentage: req.body.sslc.percentage,
      yearOfPassing: req.body.sslc.year,
      schoolAddress: req.body.sslc.address,
      board: req.body.sslc.board,
    },
    puc: {
      college: req.body.puc.college,
      percentage: req.body.puc.percentage,
      yearOfPassing: req.body.puc.year,
      collegeAddress: req.body.puc.address,
      board: req.body.puc.board,
    },
    localEntry: {
      college: req.body.diploma.college,
      percentage: req.body.diploma.percentage,
      yearOfPassing: req.body.diploma.year,
      collegeAddress: req.body.diploma.address,
      board: req.body.diploma.board,
    },
  });

  try {
    const newAcademic = await academic.save();
    res.status(201).json(newAcademic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one Academic
router.patch("/:id", getAcademic, async (req, res) => {
  if (req.body.sslc != null) {
    res.academic.sslc.school = req.body.sslc.school;
    res.academic.sslc.percentage = req.body.sslc.percentage;
    res.academic.sslc.year = req.body.sslc.year;
    res.academic.sslc.address = req.body.sslc.address;
    res.academic.sslc.board = req.body.sslc.board;
  }

  if (req.body.puc != null) {
    res.academic.puc.college = req.body.puc.college;
    res.academic.puc.percentage = req.body.puc.percentage;
    res.academic.puc.year = req.body.puc.year;
    res.academic.puc.address = req.body.puc.address;
    res.academic.puc.board = req.body.puc.board;
  }

  if (req.body.diploma != null) {
    res.academic.diploma.college = req.body.diploma.college;
    res.academic.diploma.percentage = req.body.diploma.percentage;
    res.academic.diploma.year = req.body.diploma.year;
    res.academic.diploma.address = req.body.diploma.address;
    res.academic.diploma.board = req.body.diploma.board;
  }

  try {
    const updatedAcademic = await res.academic.save();
    res.json(updatedAcademic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one Academic
router.delete("/:id", getAcademic, async (req, res) => {
  try {
    await res.academic.remove();
    res.json({ message: "Academic deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;