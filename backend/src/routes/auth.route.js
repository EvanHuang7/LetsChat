import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
  updateStickers,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Check if user is authenticated
router.get("/check", protectRoute, checkAuth);

// Update profile for logged in user
// USAGE: update user profile picture in Profile page.
router.put("/update-profile", protectRoute, updateProfile);

// Update stickers for logged in user
// USAGE: add or delete a sticker from stickers list of user.
router.put("/update-stickers", protectRoute, updateStickers);

export default router;
