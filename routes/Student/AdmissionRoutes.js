import { Router } from "express";
const router = Router();
import Admission, { find, findById, findByIdAndUpdate, findByIdAndDelete } from "../models/Admissions";

// Create Admission
router.post("/admissions", async (req, res) => {
  try {
    const admission = new Admission(req.body);
    const savedAdmission = await admission.save();
    res.status(201).json(savedAdmission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read All Admissions
router.get("/admissions", async (req, res) => {
  try {
    const admissions = await find();
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read Admission by ID
router.get("/admissions/:id", async (req, res) => {
  try {
    const admission = await findById(req.params.id);
    if (!admission) {
      return res.status(404).json({ error: "Admission not found" });
    }
    res.json(admission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Admission by ID
router.patch("/admissions/:id", async (req, res) => {
  try {
    const admission = await findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!admission) {
      return res.status(404).json({ error: "Admission not found" });
    }
    res.json(admission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Admission by ID
router.delete("/admissions/:id", async (req, res) => {
  try {
    const admission = await findByIdAndDelete(req.params.id);
    if (!admission) {
      return res.status(404).json({ error: "Admission not found" });
    }
    res.json({ message: "Admission deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
