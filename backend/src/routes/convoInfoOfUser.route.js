import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getConvoInfoOfUserbyIds,
  createConvoInfoOfUser,
  updateConvoInfoOfUser,
} from "../controllers/convoInfoOfUser.controller.js";

const router = express.Router();

// Get a conversation information for a user
// with userId and conversationId
// USAGE:
router.post("/get", protectRoute, getConvoInfoOfUserbyIds);

// Create a conversation information for a user
// USAGE:
router.post("/create", protectRoute, createConvoInfoOfUser);

// Update a conversation information for a user
// USAGE: Update "lastReadMessageSequence" field when a user clicks
// and views conversation
router.post("/update", protectRoute, updateConvoInfoOfUser);

export default router;
