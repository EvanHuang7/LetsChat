import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getConversation,
  createConversation,
  increaselatestSentMessageSequence,
  updateGroupConversation,
} from "../controllers/conversation.controller.js";

const router = express.Router();

// Get a conversation with conversationId in url param
// USAGE: Display a conversation in chat container
router.get("/:id", protectRoute, getConversation);

// Create a conversation
// USAGE: Create a conversation when a friend connection accepted or
// creating a new group conversation by a logged in user
router.post("/create", protectRoute, createConversation);

// Increase latestSentMessageSequence field of conversation
// USAGE: Increase "latestSentMessageSequence" when a new message sent
router.post(
  "/increase-message-seq",
  protectRoute,
  increaselatestSentMessageSequence
);

// Update group data of conversation
// USAGE: Update "userIds" when adding new user to group or update "groupName"
// or "groupImageUrl"
router.post("/update-group", protectRoute, updateGroupConversation);

export default router;
