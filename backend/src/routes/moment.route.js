import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMoments, postMoment } from "../controllers/moment.controller.js";

const router = express.Router();

router.get("/:id", protectRoute, getMoments);

router.post("/post", protectRoute, postMoment);

export default router;
