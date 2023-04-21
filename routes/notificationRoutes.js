const express = require("express");
const notificationController = require("../controllers/notificationController");

const router = express.Router();

router
  .post("/", notificationController.createNotification)
  .get("/:userId", notificationController.getNotifications);

module.exports = router;
