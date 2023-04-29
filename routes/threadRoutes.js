import { Router } from "express";
import {
  getAllThreads,
  createNewThread,
  getThreadById,
  deleteThread,
  closeThread,
  sendMessageToThread,
} from "../controllers/threadController.js";

const router = Router();

router.route("/").get(getAllThreads).post(createNewThread);

router
  .route("/:threadId")
  .get(getThreadById)
  .delete(deleteThread)
  .patch(closeThread);

router.route("/:threadId/messages").post(sendMessageToThread);

export default router;
