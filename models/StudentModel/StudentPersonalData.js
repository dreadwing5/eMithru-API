const mongoose = require("mongoose");

const familyDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  occupation: { company: { type: String }, position: { type: String } },
  officeAddress: { type: String },
  phone: { type: String },
  email: { type: String },
});

const studentPersonalDataSchema = new mongoose.Schema({
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  nationality: { type: String, required: true },
  religion: { type: String, required: true },
  caste: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  familyDetails: {
    father: { type: familyDetailsSchema, required: true },
    mother: { type: familyDetailsSchema, required: true },
    localGuardian: { type: familyDetailsSchema },
  },
  siblings: [{ name: { type: String }, occupation: { type: String } }],
});

module.exports = mongoose.model(
  "StudentPersonalData",
  studentPersonalDataSchema
);
