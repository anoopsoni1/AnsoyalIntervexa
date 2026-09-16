import { Router } from "express";
import {
  getCompanyProfile,
  updateCompanyProfile,
  getTeamMembers,
  updateMemberRole,
} from "../controllers/company.controller.js";
import { authenticateRecruiter } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

router.use(authenticateRecruiter);

router.get("/profile", getCompanyProfile);
router.patch("/profile", requireRole(["OWNER", "ADMIN"]), updateCompanyProfile);
router.get("/members", getTeamMembers);
router.patch("/members/:memberId/role", requireRole(["OWNER", "ADMIN"]), updateMemberRole);

export default router;
