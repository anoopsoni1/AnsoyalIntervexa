import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const possibleEnvPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "backend/.env"),
  path.resolve(process.cwd(), "../.env"),
];

for (const p of possibleEnvPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}
dotenv.config();

const rawStudentUrl =
  process.env.STUDENT_API_URL ||
  process.env.ANSOYAL_STUDENT_API_URL ||
  "https://intervexa.onrender.com/api/v1/recruiter";

const cleanStudentUrl = rawStudentUrl
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/recuriter\/?$/, "/recruiter");

const finalStudentUrl = cleanStudentUrl.endsWith("/candidates")
  ? cleanStudentUrl.replace(/\/candidates$/, "")
  : cleanStudentUrl.endsWith("/recruiter")
  ? cleanStudentUrl
  : `${cleanStudentUrl}/api/v1/recruiter`;

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5002", 10),
  MONGODB_URI:
    process.env.MONGODB_URI ||
    "mongodb+srv://intervexa11_db_user:8965863610@cluster0.dmlpki7.mongodb.net/ANSOYAL_RECRUITER_DB?retryWrites=true&w=majority",
  ACCESS_TOKEN_SECRET:
    process.env.ACCESS_TOKEN ||
    process.env.JWT_SECRET ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWI4NjZkNjY5MmIyYTE3ZjFiNjQ5NjMiLCJpYXQiOjE3ODk1NDQwNDUsImV4cCI6MTc4OTYzMDQ0NX0.wX3H66rs2oLJJnCudZ7ie57yVApLVB_WKL-Ye5nnP0I",
  ACCESS_TOKEN_EXPIRY:
    process.env.ACCESS_TOKEN_EXPIRY ||
    process.env.JWT_EXPIRES_IN ||
    "1d",
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN ||
    "K4JvZ9Y8mIYB55L5Y5Uw0BT0ltYYJaRa3mtBoTqhXHjAMl28grA4kuOx31s",
  REFRESH_TOKEN_EXPIRY:
    process.env.REFRESH_TOKEN_EXPIRY ||
    "30d",
  JWT_SECRET:
    process.env.ACCESS_TOKEN ||
    process.env.JWT_SECRET ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWI4NjZkNjY5MmIyYTE3ZjFiNjQ5NjMiLCJpYXQiOjE3ODk1NDQwNDUsImV4cCI6MTc4OTYzMDQ0NX0.wX3H66rs2oLJJnCudZ7ie57yVApLVB_WKL-Ye5nnP0I",
  JWT_EXPIRES_IN:
    process.env.ACCESS_TOKEN_EXPIRY ||
    process.env.JWT_EXPIRES_IN ||
    "1d",
  STUDENT_API_URL: finalStudentUrl,
  STUDENT_SERVICE_KEY:
    process.env.RECRUITER_SERVICE_SECRET ||
    process.env.ANSOYAL_STUDENT_SERVICE_KEY ||
    process.env.STUDENT_SERVICE_SECRET ||
    "ansoyal_recruiter_service_secret_secure_key_2026",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5174",
  REDIS_URL: process.env.REDIS_URL || "",
};
