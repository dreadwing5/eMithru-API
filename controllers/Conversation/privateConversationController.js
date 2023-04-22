const catchAsync = require("../../utils/catchAsync");
const PrivateConversation = require("../../models/Conversation/PrivateConversation");

exports.getAllConversations = catchAsync(async (req, res, next) => {
  //   const userId = req.user._id;

  const conversations = await PrivateConversation.find().populate({
    path: "participants",
    select: "name avatar",
  });

  res.status(200).json({
    status: "success",
    data: {
      conversations,
    },
  });
});

exports.getAllConversationsOfUser = catchAsync(async (req, res, next) => {
  //   const userId = req.user._id;

  const { id: userId } = req.params;
  const conversations = await PrivateConversation.find({
    participants: { $in: [userId] },
  }).populate({
    path: "participants",
    select: "name avatar",
  });

  res.status(200).json({
    status: "success",
    data: {
      conversations,
    },
  });
});

exports.createNewConversation = catchAsync(async (req, res, next) => {
  const { participants } = req.body;
  const newConversation = await PrivateConversation.create({ participants });
  res.status(201).json({
    status: "success",
    data: {
      conversation: newConversation,
    },
  });
});

exports.deleteConversation = catchAsync(async (req, res, next) => {
  const conversationId = req.params.id;
  await PrivateConversation.findByIdAndDelete(conversationId);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
