import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMoments,
  postMoment,
  updateLikeForMoment,
} from "../controllers/moment.controller.js";

const router = express.Router();

// Get 10 moments with comments for one passed in userId or all users
// USAGE: Display 10 moments in moments page
router.post("/get/:id", protectRoute, getMoments);

// Post a moment for logged in user
// USAGE: Post a moment from moment writer
router.post("/post", protectRoute, postMoment);

// Update like field of specific moment for logged in user
// USAGE: Click like button in each moment
router.post("/update-like", protectRoute, updateLikeForMoment);

export default router;
