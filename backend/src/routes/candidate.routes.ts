import { Router } from "express";
import {
  getCandidates,
  getCandidateById,
  getCandidateEvidence,
  getCandidateCredibility,
  getCandidateProjects,
  getCandidateGitHub,
  contactCandidate,
} from "../controllers/candidate.controller.js";
import { authenticateRecruiter } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateRecruiter);

router.get("/", getCandidates);
router.get("/:id", getCandidateById);
router.get("/:id/evidence", getCandidateEvidence);
router.get("/:id/credibility", getCandidateCredibility);
router.get("/:id/projects", getCandidateProjects);
router.get("/:id/github", getCandidateGitHub);
router.post("/:id/contact", contactCandidate);

export default router;
