import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // TODO: deprecate receiverId and update front-end to remove it
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  // It will create all timestamps fields, such as createdAt, UpdatedAt
  { timestamps: true }
);

// Mongo will use "messages" as table name
const Message = mongoose.model("Message", messageSchema);

export default Message;
