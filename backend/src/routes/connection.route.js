import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getConnections,
  sendConnection,
  updateConnectionStatus,
} from "../controllers/connection.controller.js";

const router = express.Router();

// Get all connection records (friends and groups) for logged in user
router.get("/get", protectRoute, getConnections);

// Send a new friend connection or group invite from logged in user
router.post("/send", protectRoute, sendConnection);

// Update (accept or reject) a connection status for logged in user
router.post("/update-status", protectRoute, updateConnectionStatus);

export default router;
