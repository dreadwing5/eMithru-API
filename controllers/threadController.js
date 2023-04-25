const catchAsync = require("../utils/catchAsync");
const Thread = require("../models/Thread");
const Message = require("../models/Conversation/Message");
exports.getAllThreads = catchAsync(async (req, res, next) => {
  const threads = await Thread.find().populate({
    path: "participants",
    select: "name avatar",
  });
  res.status(200).json({
    status: "success",
    data: {
      threads,
    },
  });
});

exports.createNewThread = catchAsync(async (req, res, next) => {
  const { createdBy, participants, title, tag } = req.body;
  const newThread = await Thread.create({
    title,
    tag,
    createdBy,
    participants,
  });
  res.status(201).json({
    status: "success",
    data: {
      thread: newThread,
    },
  });
});

exports.getThreadById = catchAsync(async (req, res, next) => {
  const { threadId } = req.params;
  const thread = await Thread.findById(threadId)
    .populate({
      path: "participants",
      select: "name avatar",
    })
    .populate("messages");
  res.status(200).json({
    status: "success",
    data: {
      thread,
    },
  });
});

exports.deleteThread = catchAsync(async (req, res, next) => {
  const threadId = req.params.id;
  await Thread.findByIdAndDelete(threadId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getThreadsByMentorAndStudent = catchAsync(async (req, res, next) => {
  const { mentorId, studentId } = req.params;
  const threads = await Thread.find({
    participants: { $all: [mentorId, studentId] },
  }).populate(
    "messages"
    // select: "name avatar",
  );
  res.status(200).json({
    status: "success",
    data: {
      threads,
    },
  });
});

exports.sendMessageToThread = catchAsync(async (req, res, next) => {
  const { threadId } = req.params;
  const { body, senderId } = req.body;
  const newMessage = await Message.create({ senderId, body });

  const updatedThread = await Thread.findByIdAndUpdate(
    threadId,
    { $push: { messages: newMessage._id } },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    data: {
      message: newMessage,
    },
  });
});
