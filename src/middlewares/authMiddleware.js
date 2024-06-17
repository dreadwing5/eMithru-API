import { createClient } from "@supabase/supabase-js";
import AppError from "../utils/appError.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PRIVATE_KEY
);

const authorizePermissions = (...requiredPermissions) => {
  return async (req, res, next) => {
    const { user } = req;

    if (!user) {
      return next(new AppError("Unauthorized access. User not found.", 403));
    }

    const { data: userPermissions, error } = await supabase
      .from("user_permissions")
      .select("permission")
      .eq("user_id", user.id);

    if (error) {
      return next(new AppError("Failed to retrieve user permissions.", 500));
    }

    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.find((p) => p.permission === permission)
    );

    if (!hasPermission) {
      return next(
        new AppError("Unauthorized access. Insufficient permissions.", 403)
      );
    }

    next();
  };
};

export { authorizePermissions };
