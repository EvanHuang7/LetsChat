import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

// NOTE: Express matches routes top to bottom, and /:id is a wildcard
// route — it will match anything unless a more specific route comes before it.
// So if we put "/:id" route on top of "/users" route, the client will
// always hit the "/:id" (getMessages) API even if it is calling
// another APIs, such as "/users" (getUsersForSidebar) API.

// Get all users except for logged in user for side bar contact list
// USAGE: Display all app users in sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// Get all messages for a conversation with conversationId in url param
// USAGE: Display all messages for a conversation in chat container
router.get("/:id", protectRoute, getMessages);

// Send a message (text or img) from logged in user
// in conversationId from url param
// USAGE: User sends a message in a conversation
router.post("/send/:id", protectRoute, sendMessage);

export default router;
