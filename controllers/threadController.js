const catchAsync = require("../utils/catchAsync");
const Thread = require("../models/Thread");
const Message = require("../models/Conversation/Message");
const AppError = require("../utils/appError");

exports.createNewThread = catchAsync(async (req, res, next) => {
  const { author, participants, title, topic } = req.body;
  const newThread = await Thread.create({
    title,
    topic,
    author,
    participants,
  });
  await newThread
    .populate({
      path: "participants",
      select: "name avatar",
    })
    .execPopulate();

  res.status(201).json({
    status: "success",
    data: {
      thread: newThread,
    },
  });
});

exports.getAllThreads = catchAsync(async (req, res, next) => {
  const threads = await Thread.find()
    .populate({
      path: "participants",
      select: "name avatar",
    })
    .populate({
      path: "author",
      select: "name avatar",
    });
  res.status(200).json({
    status: "success",
    data: {
      threads,
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

// TODO : Handle error of delete thread, example if thread is undefined or null
exports.deleteThread = catchAsync(async (req, res, next) => {
  const { threadId } = req.params;
  const thread = await Thread.findByIdAndDelete(threadId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

/**
 * Updates the status of a thread to "closed" by ID.
 *
 * @async
 * @throws {AppError} If thread is not found.
 */

exports.closeThread = catchAsync(async (req, res, next) => {
  const { threadId } = req.params;
  const updatedThread = await Thread.findByIdAndUpdate(
    threadId,
    { status: "closed", closedAt: new Date() },
    { new: true }
  );

  if (!updatedThread) {
    return next(new AppError("Thread not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      thread: updatedThread,
    },
  });
});

exports.sendMessageToThread = catchAsync(async (req, res, next) => {
  const { threadId } = req.params;
  const { body, senderId } = req.body;
  const newMessage = await Message.create({ senderId, body });

  await Thread.findByIdAndUpdate(
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

exports.getAllThreadsOfUser = catchAsync(async (req, res, next) => {
  const { id: userId } = req.params;

  const threads = await Thread.find({ participants: userId }).populate({
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
