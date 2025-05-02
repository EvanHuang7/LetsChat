import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    stickers: {
      type: [String],
      default: [
        "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2s0ZzY5ZThsMmhzcndpdGg0bXdnNDB3Mmd4eW9zNmUxcmJ2dnpzdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xUPGGDNsLvqsBOhuU0/giphy.gif",
      ],
      validate: {
        validator: function (value) {
          return value.length <= 8; // Max 8 stickers
        },
        message: "A user can only has up to 8 stickers.",
      },
    },
    messageNotificationEnabled: {
      type: Boolean,
      default: true,
    },
  },
  // It will create all timestamps fields, such as createdAt, UpdatedAt
  { timestamps: true }
);

// Mongo will use "users" as table name
const User = mongoose.model("User", userSchema);

export default User;
