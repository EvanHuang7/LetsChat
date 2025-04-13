import mongoose from "mongoose";

// A function to connect MongoDB 
// by using mongoose.connect function and MONGODB_URL 
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error: ", error);
    }
};