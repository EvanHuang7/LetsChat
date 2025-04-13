import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import { connectDB } from "./lib/db.js";

// In order to access the variable in .env file, 
// we need to call dotenv.config() function first
dotenv.config();

// We need to use process.env.varible_name to 
// access the variable in .env file
const PORT = process.env.PORT ;

const app = express();

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log("Server is starting on port: " + PORT)
    // connect MongoDB
    connectDB();
});