"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRecruiterDB = connectRecruiterDB;
exports.seedDemoRecruiter = seedDemoRecruiter;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_js_1 = require("./env.js");
const Company_model_js_1 = require("../models/Company.model.js");
const Recruiter_model_js_1 = require("../models/Recruiter.model.js");
async function connectRecruiterDB() {
    try {
        let uri = (env_js_1.ENV.MONGODB_URI || "").trim();
        if (uri.endsWith(".mongodb.net")) {
            uri += "/ANSOYAL_RECRUITER_DB?retryWrites=true&w=majority";
        }
        else if (uri.endsWith(".mongodb.net/")) {
            uri += "ANSOYAL_RECRUITER_DB?retryWrites=true&w=majority";
        }
        const conn = await mongoose_1.default.connect(uri, {
            dbName: "ANSOYAL_RECRUITER_DB",
        });
        console.log(`[RecruiterDB] Connected to MongoDB host: ${conn.connection.host}, database: ${conn.connection.name}`);
        await seedDemoRecruiter();
    }
    catch (error) {
        console.error("[RecruiterDB] Connection error:", error);
    }
}
async function seedDemoRecruiter() {
    try {
        const demoEmail = "recruiter@ansoyal.com";
        const existingRecruiter = await Recruiter_model_js_1.Recruiter.findOne({ email: demoEmail });
        if (!existingRecruiter) {
            console.log("[RecruiterDB] Seeding demo recruiter account...");
            let company = await Company_model_js_1.Company.findOne({ domain: "ansoyal.com" });
            if (!company) {
                company = await Company_model_js_1.Company.create({
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
            const salt = await bcryptjs_1.default.genSalt(10);
            const passwordHash = await bcryptjs_1.default.hash("Ansoyal2026!", salt);
            await Recruiter_model_js_1.Recruiter.create({
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
    }
    catch (err) {
        console.warn("[RecruiterDB] Demo recruiter seeding note:", err.message);
    }
}
