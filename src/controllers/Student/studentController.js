import StudentProfile from "../../models/Student/Profile.js";

import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/appError.js";
import User from "../../models/User.js";

export const createStudentProfile = catchAsync(async (req, res, next) => {
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

export const getStudentProfileById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const studentProfile = await StudentProfile.findOne({ userId: id });

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

export async function getAllStudents(req, res, next) {
  try {
    const students = await User.aggregate([
      {
        $match: {
          role: "student",
        },
      },
      {
        $lookup: {
          from: "mentorships",
          localField: "_id",
          foreignField: "mentee",
          as: "mentorship",
        },
      },
      {
        $unwind: {
          path: "$mentorship",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "mentorship.mentor",
          foreignField: "_id",
          as: "mentorData",
        },
      },
      {
        $unwind: {
          path: "$mentorData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "studentprofiles",
          localField: "_id",
          foreignField: "user",
          as: "studentProfile",
        },
      },
      {
        $unwind: "$studentProfile",
      },
      {
        $addFields: {
          name: "$name",
          usn: "$studentProfile.usn",
          mentor: {
            mentor_id: "$mentorData._id",
            name: "$mentorData.name",
            startDate: "$mentorship.startDate",
            endDate: "$mentorship.endDate",
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          usn: 1,
          mentor: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      students,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
}
