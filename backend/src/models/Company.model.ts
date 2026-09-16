import mongoose, { Schema, Document } from "mongoose";

export interface ICompany extends Document {
  name: string;
  domain: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  description?: string;
  verifiedStatus: "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    domain: { type: String, required: true, unique: true, lowercase: true, trim: true },
    logo: { type: String, default: "" },
    website: { type: String, default: "" },
    industry: { type: String, default: "Technology" },
    size: { type: String, default: "11-50 employees" },
    location: { type: String, default: "Remote" },
    description: { type: String, default: "" },
    verifiedStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "VERIFIED",
    },
  },
  { timestamps: true }
);

export const Company = mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);
