const mongoose = require("mongoose");

const personalDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  religion: {
    type: String,
    required: true,
  },
  caste: {
    type: String,
    required: true,
  },
  fathersName: {
    type: String,
    required: true,
  },
  mothersName: {
    type: String,
    required: true,
  },
  fathersOccupation: {
    type: String,
    required: true,
  },
  mothersOccupation: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  permanentAddress: {
    type: String,
    required: true,
  },
  officeAddress: {
    type: String,
    required: true,
  },
  siblings: [
    {
      name: {
        type: String,
      },
      occupation: {
        type: String,
      },
    },
  ],
  localGuardian: {
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    emailId: {
      type: String,
    },
    mobile: {
      type: String,
    },
  },
});

module.exports = mongoose.model("PersonalData", personalDataSchema);
