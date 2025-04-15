import mongoose from "mongoose";

const messageSchema =  new mongoose.Schema(
    {
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

