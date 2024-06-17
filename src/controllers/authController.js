import { createClient } from "@supabase/supabase-js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import rateLimit from "express-rate-limit";
import bcrypt from "bcrypt";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 signup requests per `window` (here, per hour)
  message: {
    status: "fail",
    message:
      "Too many signup attempts from this IP, please try again after an hour",
  },
});

export const signup = [
  signupLimiter,
  catchAsync(async (req, res, next) => {
    const { name, email, password, passwordConfirm, role } = req.body;

    if (password !== passwordConfirm) {
      return next(new AppError("Passwords do not match", 400));
    }

    // Check if the email already exists in the users table
    const { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email);

    if (selectError) {
      console.error("Select error:", selectError);
      return next(new AppError("Failed to check user existence", 500));
    }

    if (existingUser && existingUser.length > 0) {
      return next(new AppError("Email already exists", 400));
    }

    // Create the user in the Supabase authentication system
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.error("Sign-up error:", signUpError);
      return next(new AppError(signUpError.message, 400));
    }

    if (!authData || !authData.user) {
      return next(
        new AppError("Failed to create user. Please try again later.", 500)
      );
    }

    const userId = authData.user.id;

    // Hash the password before saving to database
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert the user into your database
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          id: userId,
          name,
          email,
          role: role || "user", // default to 'user' role if not provided
          status: "active",
          phone: req.body.phone || null,
          avatar: req.body.avatar || null,
          password: hashedPassword, // save hashed password
        },
      ])
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return next(new AppError("Failed to create user in the database", 500));
    }

    if (!newUser) {
      return next(new AppError("Failed to create user in the database", 500));
    }

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      status: "success",
      data: {
        user: userWithoutPassword,
      },
    });
  }),
];

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const { data: userData, error: selectError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (selectError) {
    console.error("Select error:", selectError);
    return next(new AppError("Failed to retrieve user data", 500));
  }

  if (!userData) {
    return next(new AppError("Invalid email or password", 401));
  }

  if (!userData.password) {
    return next(new AppError("User data is missing password", 500));
  }

  const isPasswordValid = await bcrypt.compare(password, userData.password);

  if (!isPasswordValid) {
    return next(new AppError("Invalid email or password", 401));
  }

  // Remove the password from the response
  const { password: __, ...userDataWithoutPassword } = userData;

  res.status(200).json({
    status: "success",
    data: {
      user: userDataWithoutPassword,
    },
  });
});

export const protect = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(
      new AppError("You are not logged in. Please log in to get access.", 401)
    );
  }

  const { user, error } = await supabase.auth.getUser(token);

  if (error) {
    return next(
      new AppError("Invalid or expired token. Please log in again.", 401)
    );
  }

  const { data: userData, error: selectError } = await supabase
    .from("users")
    .select("*")
    .eq("email", user.email)
    .single();

  if (selectError) {
    console.error("Select error:", selectError);
    return next(new AppError("Failed to retrieve user data", 500));
  }

  if (!userData) {
    return next(new AppError("User not found", 404));
  }

  req.user = userData;
  next();
});

export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return next(new AppError(error.message, 500));
  }

  res.status(200).json({
    status: "success",
    message: "Password reset instructions sent to email",
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const { access_token } = req.query;

  const { error } = await supabase.auth.updateUser(
    { password },
    { access_token }
  );

  if (error) {
    return next(new AppError(error.message, 400));
  }

  res.status(200).json({
    status: "success",
    message: "Password reset successful",
  });
});

export const logout = catchAsync(async (req, res, next) => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return next(new AppError(error.message, 500));
  }

  res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
});
