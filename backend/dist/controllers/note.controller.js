"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.addNote = exports.getCandidateNotes = void 0;
const NoteService_js_1 = require("../services/NoteService.js");
const AuditService_js_1 = require("../services/AuditService.js");
const getCandidateNotes = async (req, res, next) => {
    try {
        const { candidateId } = req.params;
        const notes = await NoteService_js_1.noteService.getCandidateNotes(req.user.companyId, req.user.id, candidateId);
        return res.status(200).json({ success: true, data: notes });
    }
    catch (error) {
        next(error);
    }
};
exports.getCandidateNotes = getCandidateNotes;
const addNote = async (req, res, next) => {
    try {
        const { candidateId, note, isPrivateToAuthor } = req.body;
        if (!candidateId || !note) {
            return res.status(400).json({
                success: false,
                message: "candidateId and note are required",
                code: "VALIDATION_ERROR",
            });
        }
        const created = await NoteService_js_1.noteService.addNote({
            companyId: req.user.companyId,
            recruiterId: req.user.id,
            recruiterName: req.user.name,
            candidateId,
            note,
            isPrivateToAuthor,
        });
        await AuditService_js_1.auditService.logAction({
            companyId: req.user.companyId,
            recruiterId: req.user.id,
            recruiterName: req.user.name,
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
    }
    catch (error) {
        next(error);
    }
};
exports.addNote = addNote;
const deleteNote = async (req, res, next) => {
    try {
        const { noteId } = req.params;
        const result = await NoteService_js_1.noteService.deleteNote(req.user.companyId, req.user.id, noteId);
        return res.status(200).json({
            success: true,
            message: "Note deleted successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteNote = deleteNote;
