const StudentProfile = require("../models/StudentModel/StudentProfile");
const StudentPersonalData = require("../models/StudentModel/StudentPersonalData");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createStudentProfile = catchAsync(async (req, res, next) => {
  // create a new student personal data document
  const {
    gender,
    nationality,
    religion,
    caste,
    permanentAddress,
    familyDetails,
    siblings,
    personalPhone,
    personalEmail,
  } = req.body.personalData;

  const studentPersonalData = new StudentPersonalData({
    gender,
    nationality,
    religion,
    caste,
    permanentAddress,
    familyDetails,
    siblings,
    personalPhone,
    personalEmail,
  });
  // save the student personal data document to the database

  const savedPersonalData = await studentPersonalData.save().catch((err) => {
    next(new AppError(err.message, 400));
  });

  if (!savedPersonalData) return;

  // create a new student profile document with the student personal data reference
  const studentProfile = new StudentProfile({
    usn: req.body.usn,
    userId: req.body.userId,
    currentSemester: req.body.currentSemester,
    department: req.body.department,
    personalData: savedPersonalData._id,
  });

  // save the student profile document to the database
  const savedProfile = await studentProfile.save().catch((err) => {
    next(new AppError(err.message, 400));
  });
  // return early if error occurs while saving the profile
  if (!savedProfile) return;
  res.status(201).json({
    status: "success",
    data: {
      studentProfile: savedProfile,
    },
  });
});

exports.getStudentProfileById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const studentProfile = await StudentProfile.findById(id).populate(
    "personalData"
  );

  if (!studentProfile) {
    return next(new AppError("Student profile not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      studentProfile,
    },
  });
});
