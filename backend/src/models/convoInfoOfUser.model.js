import mongoose from "mongoose";

const convoInfoOfUserSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    lastReadMessageSequence: {
      type: Number,
      default: 0,
    },
  },
  // It will create all timestamps fields, such as createdAt, UpdatedAt
  { timestamps: true }
);

// Mongo will use "convoInfoOfUsers" as table name
const ConvoInfoOfUser = mongoose.model(
  "ConvoInfoOfUser",
  convoInfoOfUserSchema
);

export default ConvoInfoOfUser;
