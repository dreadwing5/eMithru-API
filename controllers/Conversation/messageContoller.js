const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const Message = require("../../models/Conversation/Message");
const PrivateConversation = require("../../models/Conversation/PrivateConversation");
const GroupConversation = require("../../models/Conversation/GroupConversation");

class ConversationAdapter {
  constructor(conversation, conversationModel) {
    this.conversation = conversation;
    this.conversationModel = conversationModel;
  }

  async sendMessage(newMessage) {
    await this.conversationModel.findByIdAndUpdate(this.conversation._id, {
      $push: { messages: newMessage._id },
    });
  }

  async getMessages() {
    const conversation = await this.conversationModel
      .findById(this.conversation._id)
      .populate("messages");

    return conversation.messages;
  }
}

exports.messageController = {
  sendMessage: catchAsync(async (req, res, next) => {
    const { body, senderId } = req.body;
    const conversation = req.conversationAdapter;

    const newMessage = await Message.create({ senderId, body });
    await conversation.sendMessage(newMessage);

    res.status(201).json({
      status: "success",
      data: {
        message: newMessage,
      },
    });
  }),

  getMessagesInConversation: catchAsync(async (req, res, next) => {
    const messages = await req.conversationAdapter.getMessages();

    res.status(200).json({
      status: "success",
      data: {
        messages,
      },
    });
  }),

  deleteMessage: catchAsync(async (req, res, next) => {
    const messageId = req.params.id;
    await Message.findByIdAndDelete(messageId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  }),

  checkConversationType: async (req, res, next) => {
    const { type } = req.query;
    const { id: conversationId } = req.params;

    let conversationModel;

    if (type === "private") {
      conversationModel = PrivateConversation;
    } else if (type === "group") {
      conversationModel = GroupConversation;
    } else {
      return next(new AppError("Invalid conversation type", 400));
    }

    req.conversationAdapter = new ConversationAdapter(
      await conversationModel.findById(conversationId),
      conversationModel
    );

    next();
  },
};
