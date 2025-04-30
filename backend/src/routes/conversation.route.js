import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getConversation,
  createConversation,
  updateConversation,
  updateGroupConversation,
} from "../controllers/conversation.controller.js";

const router = express.Router();

// Get a conversation with conversationId in url param
// USAGE: Display a conversation in chat container
router.get("/:id", protectRoute, getConversation);

// Create a conversation with data passed in
// FRONT-END USAGE: Only 1 place in front-end to call this API
// to create a new Group conversation by a logged in user.
// BACK-END USAGE: Back-end call service function to create a
// friend conversation after a friend connection accepted status updated.
router.post("/create", protectRoute, createConversation);

// Update some fields of conversation
// USAGE: Increase "latestSentMessageSequence" when a new message sent
// or update "latestSentMessageId" when a new message sent
router.post("/update", protectRoute, updateConversation);

// Update group data of conversation
// USAGE: Update "userIds" when adding new user to group or update "groupName"
// or "groupImageUrl"
router.post("/update-group", protectRoute, updateGroupConversation);

export default router;
