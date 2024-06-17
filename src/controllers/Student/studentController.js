import StudentProfile from "../../models/Student/Profile.js";

import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/appError.js";
import User from "../../models/User.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

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

export const getAllStudents = catchAsync(async (req, res, next) => {
  const { data: students, error } = await supabase
    .from("users")
    .select(
      `
      id,
      name,
      role,
      mentorships(
        mentor_id,
        start_date,
        end_date,
        mentor:mentor_id(
          id,
          name
        )
      )
    `
    )
    .eq("role", "student");

  if (error) {
    console.error("Error fetching students:", error);
    return next(new AppError("Failed to fetch students", 500));
  }

  const formattedStudents = students.map((student) => ({
    id: student.id,
    name: student.name,
    role: student.role,
    mentor:
      student.mentorships.length > 0
        ? {
            mentorId: student.mentorships[0].mentor_id,
            name: student.mentorships[0].mentor.name,
            startDate: student.mentorships[0].start_date,
            endDate: student.mentorships[0].end_date,
          }
        : null,
  }));

  res.status(200).json({
    status: "success",
    data: formattedStudents,
  });
});
