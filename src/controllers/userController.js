import { createClient } from "@supabase/supabase-js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

export const getAllUsers = catchAsync(async (req, res, next) => {
  const { role } = req.query;

  let query = supabase.from("users").select("*");

  if (role) {
    query = query.eq("role", role);
  }

  const { data: users, error } = await query;

  if (error) {
    return next(new AppError(error.message, 500));
  }

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return next(new AppError(error.message, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export const createUser = catchAsync(async (req, res, next) => {
  const { name, email, phone, avatar, role, password } = req.body;

  const { user, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    return next(new AppError(signUpError.message, 400));
  }

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert([
      {
        id: user.id,
        name,
        email,
        phone,
        avatar,
        role,
        status: "active",
        password: hashedPassword,
      },
    ])
    .single();

  if (insertError) {
    return next(new AppError(insertError.message, 500));
  }

  // Remove the password from the response
  delete newUser.password;

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, avatar, role } = req.body;

  const { data: updatedUser, error } = await supabase
    .from("users")
    .update({ name, email, phone, avatar, role })
    .eq("id", id)
    .single();

  if (error) {
    return next(new AppError(error.message, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const { error: deleteError } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return next(new AppError(deleteError.message, 500));
  }

  res.status(204).json();
});
