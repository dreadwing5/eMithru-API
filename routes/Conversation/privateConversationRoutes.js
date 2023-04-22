const express = require("express");

const privateConversationController = require("../../controllers/Conversation/privateConversationController");

const router = express.Router();

router
  .route("/")
  .get(privateConversationController.getAllConversationsOfUser)
  .post(privateConversationController.createNewConversation);

router.route("/:id").delete(privateConversationController.deleteConversation);

module.exports = router;
