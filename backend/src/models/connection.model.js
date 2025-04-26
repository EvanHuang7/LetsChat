import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // TODO: remove it because it's depcreated
    groupName: {
      type: String,
    },
    // It's not required because we don't have conversationId yet when
    // 2 users are not friend
    groupConversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    message: {
      type: String,
    },
  },
  // It will create all timestamps fields, such as createdAt, UpdatedAt
  { timestamps: true }
);

// Mongo will use "connections" as table name
const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;
