import mongoose, { Schema, Document } from "mongoose";

export type ShortlistStatus = "SHORTLISTED" | "CONTACTED" | "INTERVIEWING" | "REJECTED" | "HIRED";

export interface IShortlist extends Document {
  companyId: mongoose.Types.ObjectId;
  recruiterId: mongoose.Types.ObjectId;
  candidateId: string; // References Student Platform userId
  status: ShortlistStatus;
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShortlistSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    recruiterId: { type: Schema.Types.ObjectId, ref: "Recruiter", required: true },
    candidateId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["SHORTLISTED", "CONTACTED", "INTERVIEWING", "REJECTED", "HIRED"],
      default: "SHORTLISTED",
    },
    tags: { type: [String], default: [] },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

// Prevent duplicate shortlisting of same candidate within same company
ShortlistSchema.index({ companyId: 1, candidateId: 1 }, { unique: true });

export const Shortlist =
  mongoose.models.Shortlist || mongoose.model<IShortlist>("Shortlist", ShortlistSchema);
