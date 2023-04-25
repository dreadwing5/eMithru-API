const express = require("express");
const threadController = require("../controllers/threadController");
const router = express.Router();

router
  .route("/")
  .get(threadController.getAllThreads)
  .post(threadController.createNewThread);

router
  .route("/:threadId")
  .get(threadController.getThreadById)
  .delete(threadController.deleteThread);

router
  .route("/search/:mentorId/:studentId")
  .get(threadController.getThreadsByMentorAndStudent);

router.route("/:threadId/messages").post(threadController.sendMessageToThread);

module.exports = router;
