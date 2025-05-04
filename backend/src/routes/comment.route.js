import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getCommentsWithMomentIds,
  postComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

// FRONT-END USAGE: Get comments for passed in momentIds or ALL comments of ALL moments
// BACK-END USAGE:
router.post("/get-comments", protectRoute, getCommentsWithMomentIds);

// FRONT-END USAGE: Post a comment under a moment for logged in user
// BACK-END USAGE:
router.post("/post", protectRoute, postComment);

export default router;
