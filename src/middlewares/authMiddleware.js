import AppError from "../utils/appError.js";

const authorizePermissions = (...requiredPermissions) => {
  return async (req, res, next) => {
    const userRole = await req.user.role.populate("permissions");
    const userPermissions = userRole.permissions;

    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
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
