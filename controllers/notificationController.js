const Notification = require("../models/Notification");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getNotifications = catchAsync(async (req, res, next) => {
  const filter = { userId: req.params.userId };
  if (req.query.unread) {
    filter.isUnread = true;
  }
  const notifications = await Notification.find(filter);
  res.status(200).json({ notifications });
});

exports.createNotification = catchAsync(async (req, res, next) => {
  const { userId, title, description, type } = req.body;
  const notification = await Notification.create({
    userId,
    title,
    description,
    type,
    isUnread: true,
  });
  if (!notification) {
    return next(AppError("Failed to create notification", 500));
  }
  res.status(201).json({ notification });
});
