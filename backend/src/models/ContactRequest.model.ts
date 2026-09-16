import mongoose, { Schema, Document } from "mongoose";

export interface IContactRequest extends Document {
  companyId: mongoose.Types.ObjectId;
  recruiterId: mongoose.Types.ObjectId;
  candidateId: string;
  subject: string;
  message: string;
  roleTitle?: string;
  status: "PENDING" | "DELIVERED" | "FAILED";
  createdAt: Date;
  updatedAt: Date;
}

const ContactRequestSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    recruiterId: { type: Schema.Types.ObjectId, ref: "Recruiter", required: true },
    candidateId: { type: String, required: true, index: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    roleTitle: { type: String, default: "" },
    status: {
      type: String,
      enum: ["PENDING", "DELIVERED", "FAILED"],
      default: "DELIVERED",
    },
  },
  { timestamps: true }
);

export const ContactRequest =
  mongoose.models.ContactRequest ||
  mongoose.model<IContactRequest>("ContactRequest", ContactRequestSchema);
