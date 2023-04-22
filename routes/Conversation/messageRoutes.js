const express = require("express");
const {
  messageController,
} = require("../../controllers/Conversation/messageContoller");

const router = express.Router();

router
  .route("/:id")
  .get(
    messageController.checkConversationType,
    messageController.getMessagesInConversation
  )
  .post(messageController.checkConversationType, messageController.sendMessage)
  .delete(messageController.deleteMessage);

module.exports = router;
