import mongoose from "mongoose";

const userSchema =  new mongoose.Schema(
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
        profielPic: {
            type: String,
            default: "",
        },
    },
    // It will create all timestamps fields, such as createdAt, UpdatedAt
    { timestamps: true }
);

// Mongo will use "users" as table name
const User = mongoose.model("User", userSchema);

export default User;

