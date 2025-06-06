import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

// NOTE: Express matches routes top to bottom, and /:id is a wildcard
// route — it will match anything unless a more specific route comes before it.
// So if we put "/:id" route on top of "/users" route, the client will
// always hit the "/:id" (getMessages) API even if it is calling
// another APIs, such as "/users" (getUsersForSidebar) API.

// Get all messages for a conversation with conversationId in url param
// FRONT-END USAGE: Display all messages for a conversation
// in chat container after user selected a conversation.
// BACK-END USAGE:
router.get("/:id", protectRoute, getMessages);

// Send a message (text or img) from logged in user
// in conversationId from url param.
// FRONT-END USAGE: User sends a message in a conversation
// BACK-END USAGE:
router.post("/send/:id", protectRoute, sendMessage);

export default router;
