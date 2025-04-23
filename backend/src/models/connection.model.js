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
    // TODO: change to groupId and refer to new
    // group table and required
    groupName: {
      type: String,
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
