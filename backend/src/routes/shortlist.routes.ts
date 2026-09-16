import { Router } from "express";
import {
  getShortlists,
  addToShortlist,
  updateShortlistStatus,
  removeFromShortlist,
} from "../controllers/shortlist.controller.js";
import { authenticateRecruiter } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateRecruiter);

router.get("/", getShortlists);
router.post("/", addToShortlist);
router.patch("/:id", updateShortlistStatus);
router.delete("/:id", removeFromShortlist);

export default router;
