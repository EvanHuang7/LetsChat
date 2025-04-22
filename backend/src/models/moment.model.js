import mongoose from "mongoose";

const momentSchema = new mongoose.Schema(
  {
    posterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    userIdsOfLike: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  // It will create all timestamps fields, such as createdAt, UpdatedAt
  { timestamps: true }
);

// Mongo will use "moments" as table name
const Moment = mongoose.model("Moment", momentSchema);

export default Moment;
