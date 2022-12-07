const router = require("express").Router();

const Conversation = require("../models/Conversation");

router.post("/:studentId", async (req, res) => {
  //check if thread already exists
  const conversation = await Conversation.findOne({
    conversationId: req.params.studentId,
  });

  if (conversation) {
    return res.status(400).json({ message: "Conversation already exists" });
  }

  const newConversation = new Conversation({
    conversationId: req.params.studentId,
    status: "active",
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conversation of a user ( each conversation will be mapped to a student)
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      conversationId: req.params.userId,
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});
