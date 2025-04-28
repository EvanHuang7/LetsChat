import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getConnections,
  getUsersForConnection,
  getSpecifiedConnection,
  sendConnection,
  updateConnectionStatus,
} from "../controllers/connection.controller.js";

const router = express.Router();

// Get all connection records (friends and groups)
// for logged in user as receiver.
// USAGE: display the connections data for logged in user
// in New connection page.
router.get("/get", protectRoute, getConnections);

// Get all users except for logged in user with connection status
// USAGE: Display all app users in new connection page
router.get("/users", protectRoute, getUsersForConnection);

// Get specified connections between logged in user
// and selected user.
// USAGE: display connection status between two users in Chat
// box header when selecting a user from sidebar.
router.post("/get-specified", protectRoute, getSpecifiedConnection);

// Send a new friend connection or group invite from logged in user.
// USAGE: send out a friend connection request in Chat box header.
router.post("/send", protectRoute, sendConnection);

// Update (accept or reject) a connection status for logged in user
// USAGE: Accept or reject a connection in new connection page.
router.post("/update-status", protectRoute, updateConnectionStatus);

export default router;
