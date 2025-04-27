import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getConvoInfoOfUserbyIds,
  createConvoInfoOfUser,
  updateConvoInfoOfUser,
} from "../controllers/convoInfoOfUser.controller.js";

const router = express.Router();

// Get all conversation information for logged user
// USAGE: Display all conversations when logged user views
// friends + groups / all conversations list
router.get("/getAll", protectRoute, getAllConvoInfoOfUser);

// Get a conversation information for logged in user
// with userId and conversationId
// USAGE:
router.post("/get", protectRoute, getConvoInfoOfUserbyIds);

// Create a conversation information for logged in user
// USAGE:
router.post("/create", protectRoute, createConvoInfoOfUser);

// Update a conversation information for logged in user
// USAGE: Update "lastReadMessageSequence" field when a user clicks
// and views conversation
router.post("/update", protectRoute, updateConvoInfoOfUser);

export default router;
