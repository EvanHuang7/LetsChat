import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    posterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    momentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Moment",
      required: true,
    },
    text: {
      type: String,
    },
  },
  // It will create all timestamps fields, such as createdAt, UpdatedAt
  { timestamps: true }
);

// Mongo will use "comments" as table name
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
