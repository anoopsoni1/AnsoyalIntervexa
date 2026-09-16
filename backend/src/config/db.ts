import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ENV } from "./env.js";
import { Company } from "../models/Company.model.js";
import { Recruiter } from "../models/Recruiter.model.js";

export async function connectRecruiterDB(): Promise<void> {
  try {
    let uri = (ENV.MONGODB_URI || "").trim();
    if (uri.endsWith(".mongodb.net")) {
      uri += "/ANSOYAL_RECRUITER_DB?retryWrites=true&w=majority";
    } else if (uri.endsWith(".mongodb.net/")) {
      uri += "ANSOYAL_RECRUITER_DB?retryWrites=true&w=majority";
    }

    const conn = await mongoose.connect(uri, {
      dbName: "ANSOYAL_RECRUITER_DB",
    });
    console.log(`[RecruiterDB] Connected to MongoDB host: ${conn.connection.host}, database: ${conn.connection.name}`);

    await seedDemoRecruiter();
  } catch (error) {
    console.error("[RecruiterDB] Connection error:", error);
  }
}

export async function seedDemoRecruiter(): Promise<void> {
  try {
    const demoEmail = "recruiter@ansoyal.com";
    const existingRecruiter = await Recruiter.findOne({ email: demoEmail });

    if (!existingRecruiter) {
      console.log("[RecruiterDB] Seeding demo recruiter account...");
      let company = await Company.findOne({ domain: "ansoyal.com" });
      if (!company) {
        company = await Company.create({
          name: "Ansoyal AI Technologies",
          domain: "ansoyal.com",
          website: "https://ansoyal.com",
          industry: "AI & Talent Discovery",
          size: "50-200 employees",
          location: "San Francisco / Remote",
          description: "Next-generation evidence-based talent recruitment platform.",
          verifiedStatus: "VERIFIED",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash("Ansoyal2026!", salt);

      await Recruiter.create({
        name: "Demo Recruiter",
        email: demoEmail,
        passwordHash,
        companyId: company._id,
        role: "OWNER",
        designation: "Head of Talent Acquisition",
        permissions: ["CANDIDATE_VIEW", "CANDIDATE_SHORTLIST", "CANDIDATE_CONTACT", "NOTES_MANAGE"],
        isEmailVerified: true,
      });

      console.log(`[RecruiterDB] Demo recruiter successfully seeded: ${demoEmail} / Ansoyal2026!`);
    }
  } catch (err) {
    console.warn("[RecruiterDB] Demo recruiter seeding note:", (err as any).message);
  }
}
