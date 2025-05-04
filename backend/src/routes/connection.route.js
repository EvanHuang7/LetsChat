import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getConnections,
  getUsersForConnection,
  getSpecifiedConnection,
  sendConnection,
  updateConnectionStatus,
  getAllFriendUsers,
  sendBatchGroupInvitation,
} from "../controllers/connection.controller.js";

const router = express.Router();

// Get all connection records (friends and groups)
// for logged in user as receiver.
// FRONT-END USAGE: display all connections data for logged in user
// in New connection page.
// BACK-END USAGE:
router.get("/get", protectRoute, getConnections);

// Get all users except for logged in user with connection status
// FRONT-END USAGE: Display all app users in new connection page
// BACK-END USAGE:
router.get("/users", protectRoute, getUsersForConnection);

// Send a new friend connection or group invite from logged in user.
// FRONT-END USAGE: send out a friend connection request in all users section.
// BACK-END USAGE:
router.post("/send", protectRoute, sendConnection);

// Get all friend users or filtered friend users for logged in user
// FRONT-END USAGE: Display friend users to invite them into a group
// BACK-END USAGE:
router.post("/friend-users", protectRoute, getAllFriendUsers);

// Send a batch of group invitations to a user list
// FRONT-END USAGE: Invite a list of friends to join a group
// BACK-END USAGE:
router.post("/send-batch-group", protectRoute, sendBatchGroupInvitation);

// Update (accept or reject) a connection status for logged in user.
// FRONT-END USAGE: Accept or reject a connection in new connection page.
// BACK-END USAGE:
router.post("/update-status", protectRoute, updateConnectionStatus);

// Get specified connections between logged in user
// and selected user.
// FRONT-END USAGE:
// BACK-END USAGE:
router.post("/get-specified", protectRoute, getSpecifiedConnection);

export default router;
