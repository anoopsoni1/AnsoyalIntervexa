import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  companyId: mongoose.Types.ObjectId;
  recruiterId: mongoose.Types.ObjectId;
  recruiterName: string;
  action: string;
  candidateId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    recruiterId: { type: Schema.Types.ObjectId, ref: "Recruiter", required: true },
    recruiterName: { type: String, default: "" },
    action: {
      type: String,
      required: true,
      enum: [
        "CANDIDATE_VIEWED",
        "CANDIDATE_SHORTLISTED",
        "SHORTLIST_STAGE_UPDATED",
        "CANDIDATE_CONTACTED",
        "NOTE_ADDED",
        "RESUME_ACCESSED",
        "EVIDENCE_INSPECTED",
      ],
    },
    candidateId: { type: String, default: null, index: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
