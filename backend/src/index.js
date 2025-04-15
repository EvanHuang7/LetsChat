import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

// In order to access the variable in .env file, 
// we need to call dotenv.config() function first
dotenv.config();

// We need to use process.env.varible_name to 
// access the variable in .env file
const PORT = process.env.PORT ;

// Create an Express application
const app = express();

// Allow us to extrat the json data form api request body 
app.use(express.json());
// Allow us to parse the cookies from the api request
app.use(cookieParser());

// Set up API routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
    console.log("Server is starting on port: " + PORT)
    // connect MongoDB
    connectDB();
});