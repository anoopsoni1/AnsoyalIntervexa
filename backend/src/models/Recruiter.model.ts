import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export type RecruiterRole = "OWNER" | "ADMIN" | "RECRUITER" | "HIRING_MANAGER";

export interface IRecruiter extends Document {
  name: string;
  email: string;
  passwordHash: string;
  companyId: mongoose.Types.ObjectId;
  role: RecruiterRole;
  designation: string;
  permissions: string[];
  isEmailVerified: boolean;
  avatar?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  isPasswordCorrect(password: string): Promise<boolean>;
}

const RecruiterSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, index: true },
    role: {
      type: String,
      enum: ["OWNER", "ADMIN", "RECRUITER", "HIRING_MANAGER"],
      default: "RECRUITER",
    },
    designation: { type: String, default: "Talent Acquisition Specialist" },
    permissions: {
      type: [String],
      default: ["CANDIDATE_VIEW", "CANDIDATE_SHORTLIST", "CANDIDATE_CONTACT", "NOTES_MANAGE"],
    },
    isEmailVerified: { type: Boolean, default: true },
    avatar: { type: String, default: "" },
    refreshToken: { type: String, default: "" },
  },
  { timestamps: true }
);

RecruiterSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
  if (!password || !this.passwordHash) return false;
  return bcrypt.compare(password, this.passwordHash);
};

export const Recruiter =
  mongoose.models.Recruiter || mongoose.model<IRecruiter>("Recruiter", RecruiterSchema);
