import { Router } from "express";
import { getDashboardMetrics } from "../controllers/dashboard.controller.js";
import { authenticateRecruiter } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateRecruiter);

router.get("/metrics", getDashboardMetrics);

export default router;
