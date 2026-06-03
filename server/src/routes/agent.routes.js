import express from "express";
import { createAgent, getAgents } from "../controllers/agent.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createAgent);
router.get("/", getAgents);

export default router;
