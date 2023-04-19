const StudentProfile = require("../../models/Student/Profile");

const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

exports.createStudentProfile = catchAsync(async (req, res, next) => {
  // create a new student personal data document
  const {
    userId,
    fullName,
    department,
    nameOnMarksheet,
    personalEmail,
    email,
    usn,
    dateOfBirth,
    bloodGroup,
    mobileNumber,
    alternatePhoneNumber,
    nationality,
    domicile,
    religion,
    category,
    caste,
    hostelite,
    subCaste,
    aadharCardNumber,
    physicallyChallenged,
    admissionDate,
    sportsLevel,
    defenceOrExServiceman,
    isForeigner,
    photo,
  } = req.body;

  const studentProfile = new StudentProfile({
    userId,
    fullName,
    department,
    nameOnMarksheet,
    personalEmail,
    email,
    usn,
    dateOfBirth,
    bloodGroup,
    mobileNumber,
    alternatePhoneNumber,
    nationality,
    domicile,
    religion,
    category,
    caste,
    hostelite,
    subCaste,
    aadharCardNumber,
    physicallyChallenged,
    admissionDate,
    sportsLevel,
    defenceOrExServiceman,
    isForeigner,
    photo,
  });

  // save the student personal data document to the database
  const savedProfile = await studentProfile.save().catch((err) => {
    next(new AppError(err.message, 400));
  });

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

  const studentProfile = await StudentProfile.findById(id);

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
