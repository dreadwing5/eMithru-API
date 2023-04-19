const mongoose = require("mongoose");

const { Schema } = mongoose;

const studentProfileSchema = new Schema({
  fullName: {
    firstName: { type: String, required: true },
    middleName: String,
    lastName: { type: String, required: true },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  nameOnMarksheet: { type: String, required: true },
  personalEmail: { type: String, required: true },
  email: { type: String, required: true },
  usn: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  bloodGroup: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  alternatePhoneNumber: String,
  nationality: { type: String, required: true },
  domicile: String,
  religion: String,
  category: String,
  caste: String,
  hostelite: String,
  subCaste: String,
  aadharCardNumber: {
    type: String,
    required: true,
    minlength: 12,
    maxlength: 12,
  },
  physicallyChallenged: { type: Boolean, required: true },
  admissionDate: { type: Date, required: true },
  sportsLevel: {
    type: String,
    enum: ["State", "National", "International", "Not Applicable"],
  },
  defenceOrExServiceman: {
    type: String,
    enum: ["Defence", "Ex-Serviceman", "Not Applicable"],
  },
  isForeigner: { type: Boolean, required: true },
  photo: String,
});

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);

module.exports = StudentProfile;
