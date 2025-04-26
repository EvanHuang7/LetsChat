import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    userIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      validate: {
        validator: function (val) {
          // must have at least 1 user if creating a new group conversation
          return val.length >= 1 && val.length <= 100;
        },
        message:
          "A conversation must have at least 1 user and at most 100 users",
      },
    },
    // Used this field for auto-increment when a new message sent
    // We can use it and converstionID to get latestSentMessage info
    latestSentMessageSequence: {
      type: Number,
      default: 0,
    },
    isGroup: {
      type: Boolean,
      required: true,
    },
    groupName: {
      type: String,
      default: "",
    },
    groupImageUrl: {
      type: String,
      default: "",
    },
  },
  // It will create all timestamps fields, such as createdAt, UpdatedAt
  { timestamps: true }
);

// Mongo will use "conversations" as table name
const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
