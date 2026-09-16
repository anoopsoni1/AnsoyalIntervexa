import { RecruiterNote } from "../models/RecruiterNote.model.js";

export class NoteService {
  public async getCandidateNotes(companyId: string, recruiterId: string, candidateId: string) {
    const notes = await RecruiterNote.find({
      companyId,
      candidateId,
      $or: [{ isPrivateToAuthor: false }, { recruiterId }],
    }).sort({ createdAt: -1 });

    return notes;
  }

  public async addNote(data: {
    companyId: string;
    recruiterId: string;
    recruiterName: string;
    candidateId: string;
    note: string;
    isPrivateToAuthor?: boolean;
  }) {
    const newNote = await RecruiterNote.create({
      companyId: data.companyId,
      recruiterId: data.recruiterId,
      recruiterName: data.recruiterName,
      candidateId: data.candidateId,
      note: data.note,
      isPrivateToAuthor: data.isPrivateToAuthor || false,
    });

    return newNote;
  }

  public async deleteNote(companyId: string, recruiterId: string, noteId: string) {
    const note = await RecruiterNote.findOne({ _id: noteId, companyId });
    if (!note) {
      const err = new Error("Note not found in your company");
      (err as any).statusCode = 404;
      throw err;
    }

    if (note.recruiterId.toString() !== recruiterId) {
      const err = new Error("You can only delete your own notes");
      (err as any).statusCode = 403;
      throw err;
    }

    await RecruiterNote.findByIdAndDelete(noteId);
    return { success: true };
  }
}

export const noteService = new NoteService();
