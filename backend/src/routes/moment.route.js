import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMoments,
  postMoment,
  updateLikeForMoment,
} from "../controllers/moment.controller.js";

const router = express.Router();

// Get all moments with comments for one passed in userId or all users
router.get("/:id", protectRoute, getMoments);

// Post a moment for logged in user
router.post("/post", protectRoute, postMoment);

// Update like field of specific moment for logged in user
router.post("/update-like", protectRoute, updateLikeForMoment);

export default router;
