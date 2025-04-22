import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getCommentsWithMomentIds,
  postComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

// Get comments for passed in momentIds or ALL comments of ALL moments
router.post("/get-comments", protectRoute, getCommentsWithMomentIds);

// Post a comment under a moment for logged in user
router.post("/post", protectRoute, postComment);

export default router;
