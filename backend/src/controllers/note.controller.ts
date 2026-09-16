import { Response, NextFunction } from "express";
import { noteService } from "../services/NoteService.js";
import { auditService } from "../services/AuditService.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const getCandidateNotes = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { candidateId } = req.params;
    const notes = await noteService.getCandidateNotes(
      req.user!.companyId,
      req.user!.id,
      candidateId
    );
    return res.status(200).json({ success: true, data: notes });
  } catch (error) {
    next(error);
  }
};

export const addNote = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { candidateId, note, isPrivateToAuthor } = req.body;
    if (!candidateId || !note) {
      return res.status(400).json({
        success: false,
        message: "candidateId and note are required",
        code: "VALIDATION_ERROR",
      });
    }

    const created = await noteService.addNote({
      companyId: req.user!.companyId,
      recruiterId: req.user!.id,
      recruiterName: req.user!.name,
      candidateId,
      note,
      isPrivateToAuthor,
    });

    await auditService.logAction({
      companyId: req.user!.companyId,
      recruiterId: req.user!.id,
      recruiterName: req.user!.name,
      action: "NOTE_ADDED",
      candidateId,
      metadata: { isPrivate: Boolean(isPrivateToAuthor) },
      ipAddress: req.ip || "",
    });

    return res.status(201).json({
      success: true,
      message: "Note added successfully",
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { noteId } = req.params;
    const result = await noteService.deleteNote(
      req.user!.companyId,
      req.user!.id,
      noteId
    );
    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
