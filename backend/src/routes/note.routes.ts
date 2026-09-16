import { Router } from "express";
import { getCandidateNotes, addNote, deleteNote } from "../controllers/note.controller.js";
import { authenticateRecruiter } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateRecruiter);

router.get("/:candidateId", getCandidateNotes);
router.post("/", addNote);
router.delete("/:noteId", deleteNote);

export default router;
