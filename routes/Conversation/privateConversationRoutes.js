const express = require("express");

const privateConversationController = require("../../controllers/Conversation/privateConversationController");

const router = express.Router();

router
  .route("/")
  .get(privateConversationController.getAllConversations)
  .post(privateConversationController.createNewConversation);

router
  .route("/:id")
  .get(privateConversationController.getAllConversationsOfUser)
  .delete(privateConversationController.deleteConversation);

module.exports = router;
