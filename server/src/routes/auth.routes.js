import express from "express";
import {
    userLogin,
    userRegister,
    getCurrentUser
} from '../controllers/auth.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/me", protect, getCurrentUser);

export default router;