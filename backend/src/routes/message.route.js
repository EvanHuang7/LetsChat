import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

// Get all users except for logged in user for side bar contact list
router.get("/users", protectRoute, getUsersForSidebar);

// Get all messages between the passed in userId in url and logged in user
router.get("/:id", protectRoute, getMessages);

// Send a message (text or img) from logged in user to
// the passed in userId in url
router.post("/send/:id", protectRoute, sendMessage);

export default router;
