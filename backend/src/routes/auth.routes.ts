import { Router } from "express";
import { register, login, getMe, logout, refreshToken } from "../controllers/auth.controller.js";
import { authenticateRecruiter } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.get("/me", authenticateRecruiter, getMe);
router.post("/logout", authenticateRecruiter, logout);

export default router;
