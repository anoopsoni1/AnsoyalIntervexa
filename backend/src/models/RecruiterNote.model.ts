import mongoose, { Schema, Document } from "mongoose";

export interface IRecruiterNote extends Document {
  companyId: mongoose.Types.ObjectId;
  recruiterId: mongoose.Types.ObjectId;
  recruiterName: string;
  candidateId: string;
  note: string;
  isPrivateToAuthor: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RecruiterNoteSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    recruiterId: { type: Schema.Types.ObjectId, ref: "Recruiter", required: true },
    recruiterName: { type: String, required: true },
    candidateId: { type: String, required: true, index: true },
    note: { type: String, required: true, trim: true },
    isPrivateToAuthor: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const RecruiterNote =
  mongoose.models.RecruiterNote ||
  mongoose.model<IRecruiterNote>("RecruiterNote", RecruiterNoteSchema);
