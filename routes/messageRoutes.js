const router = require("express").Router();
const Message = require("../models/Message");

//new message
router.post("/", async (req, res) => {
  const newMessage = {
    conversation: req.body.conversationId,
    from: req.body.senderId,
    body: req.body.body,
  };
  const message = new Message(newMessage);
  try {
    const savedMessage = await message.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//find all messages of a particular conversation
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversation: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
