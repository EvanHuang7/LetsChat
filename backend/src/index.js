import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import connectionRoutes from "./routes/connection.route.js";
import messageRoutes from "./routes/message.route.js";
import momentRoutes from "./routes/moment.route.js";
import commentRoutes from "./routes/comment.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

// In order to access the variable in .env file,
// we need to call dotenv.config() function first
dotenv.config();

// We need to use process.env.varible_name to
// access the variable in .env file
const PORT = process.env.PORT;

// Allow us to extrat the json data form api request body
app.use(express.json({ limit: "2mb" }));
// Allow us to parse the cookies from the api request
app.use(cookieParser());
// Allow front end client to call the backend endpoints from different port and
// allow the authentication cookie (JWT token) to be included in api call reqeust
// front-end port is 5173, back-end port is 5001.
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Set up API routes
app.use("/api/auth", authRoutes);
app.use("/api/connection", connectionRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/moment", momentRoutes);
app.use("/api/comment", commentRoutes);

server.listen(PORT, () => {
  console.log("Server is starting on port: " + PORT);
  // connect MongoDB
  connectDB();
});
