import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getAllConvoInfoOfUser,
  getConvoInfoOfUserbyIds,
  createConvoInfoOfUser,
  updateConvoInfoOfUser,
} from "../controllers/convoInfoOfUser.controller.js";

const router = express.Router();

// Get all conversation information for logged in user
// FRONT-END USAGE: Display all conversations when logged in user views.
// friends + groups / all conversations list in sidebar
// BACK-END USAGE:
router.get("/getAll", protectRoute, getAllConvoInfoOfUser);

// Get a conversation information for logged in user
// with userId and conversationId.
// FRONT-END USAGE:
// BACK-END USAGE: Call the service function to get a updated convoInfoOfUser
// after group created updated a group conversation info.
router.post("/get", protectRoute, getConvoInfoOfUserbyIds);

// Create a conversation information for logged in user.
// FRONT-END USAGE:
// BACK-END USAGE: Call the service function to create a convoInfoOfUser
// when a new group conversation created or a new user accepts group invite.
// Or, create 2 convoInfoOfUser records when a user accept friend connection.
router.post("/create", protectRoute, createConvoInfoOfUser);

// Update a conversation information for logged in user
// FRONT-END USAGE: Update "lastReadMessageSequence" field when a user clicked
// and viewed a conversation or, left a conversation.
// BACK-END USAGE:
router.post("/update", protectRoute, updateConvoInfoOfUser);

export default router;
