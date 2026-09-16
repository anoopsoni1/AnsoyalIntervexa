"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteService = exports.NoteService = void 0;
const RecruiterNote_model_js_1 = require("../models/RecruiterNote.model.js");
class NoteService {
    async getCandidateNotes(companyId, recruiterId, candidateId) {
        const notes = await RecruiterNote_model_js_1.RecruiterNote.find({
            companyId,
            candidateId,
            $or: [{ isPrivateToAuthor: false }, { recruiterId }],
        }).sort({ createdAt: -1 });
        return notes;
    }
    async addNote(data) {
        const newNote = await RecruiterNote_model_js_1.RecruiterNote.create({
            companyId: data.companyId,
            recruiterId: data.recruiterId,
            recruiterName: data.recruiterName,
            candidateId: data.candidateId,
            note: data.note,
            isPrivateToAuthor: data.isPrivateToAuthor || false,
        });
        return newNote;
    }
    async deleteNote(companyId, recruiterId, noteId) {
        const note = await RecruiterNote_model_js_1.RecruiterNote.findOne({ _id: noteId, companyId });
        if (!note) {
            const err = new Error("Note not found in your company");
            err.statusCode = 404;
            throw err;
        }
        if (note.recruiterId.toString() !== recruiterId) {
            const err = new Error("You can only delete your own notes");
            err.statusCode = 403;
            throw err;
        }
        await RecruiterNote_model_js_1.RecruiterNote.findByIdAndDelete(noteId);
        return { success: true };
    }
}
exports.NoteService = NoteService;
exports.noteService = new NoteService();
