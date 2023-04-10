const mongoose = require("mongoose");

// PersonalData schema
const PersonalDataSchema = new Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  nationality: { type: String, required: true },
  religion: { type: String },
  caste: { type: String },
  fatherName: { type: String },
  motherName: { type: String },
  fatherOccupation: { type: String },
  motherOccupation: { type: String },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  permanentAddress: { type: String },
  officeAddress: { type: String },
  siblings: [{ type: String }],
  localGuardian: { type: Schema.Types.ObjectId, ref: "LocalGuardian" },
});

// LocalGuardian schema
const LocalGuardianSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
});

// Exporting models
module.exports.PersonalData = mongoose.model(
  "PersonalData",
  PersonalDataSchema
);
module.exports.LocalGuardian = mongoose.model(
  "LocalGuardian",
  LocalGuardianSchema
);
