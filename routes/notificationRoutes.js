import { Router } from "express";
import { createNotification, getNotifications } from "../controllers/notificationController";

const router = Router();

router
  .post("/", createNotification)
  .get("/:userId", getNotifications);

export default router;
