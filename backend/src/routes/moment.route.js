import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMoments,
  postMoment,
  updateLikeForMoment,
} from "../controllers/moment.controller.js";

const router = express.Router();

// Get 10 moments with comments for one passed in userId or all users
// FRONT-END USAGE: Display 10 moments in moments page
// BACK-END USAGE:
router.post("/get/:id", protectRoute, getMoments);

// Post a moment for logged in user
// FRONT-END USAGE: Post a moment from moment writer
// BACK-END USAGE:
router.post("/post", protectRoute, postMoment);

// Update like field of specific moment for logged in user
// FRONT-END USAGE: Click like button in each moment
// BACK-END USAGE:
router.post("/update-like", protectRoute, updateLikeForMoment);

export default router;
