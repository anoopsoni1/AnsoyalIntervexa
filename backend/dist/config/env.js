"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const possibleEnvPaths = [
    path_1.default.resolve(process.cwd(), ".env"),
    path_1.default.resolve(process.cwd(), "backend/.env"),
    path_1.default.resolve(process.cwd(), "../.env"),
];
for (const p of possibleEnvPaths) {
    if (fs_1.default.existsSync(p)) {
        dotenv_1.default.config({ path: p });
        break;
    }
}
dotenv_1.default.config();
exports.ENV = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "5002", 10),
    MONGODB_URI: process.env.MONGODB_URI ||
        "mongodb+srv://ansoyalai:ansoyalai@cluster0.dmlpki7.mongodb.net/ANSOYAL_RECRUITER_DB?retryWrites=true&w=majority",
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN ||
        process.env.JWT_SECRET ||
        "vewb37OPcFl2gZrc1zCacjCqsKajDyHfozOG4MOhfAbuUWvj1VE6UbEe",
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY ||
        process.env.JWT_EXPIRES_IN ||
        "1d",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN ||
        "K4JvZ9Y8mIYB55L5Y5Uw0BT0ltYYJaRa3mtBoTqhXHjAMl28grA4kuOx31s",
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY ||
        "30d",
    JWT_SECRET: process.env.ACCESS_TOKEN ||
        process.env.JWT_SECRET ||
        "vewb37OPcFl2gZrc1zCacjCqsKajDyHfozOG4MOhfAbuUWvj1VE6UbEe",
    JWT_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRY ||
        process.env.JWT_EXPIRES_IN ||
        "1d",
    STUDENT_API_URL: process.env.ANSOYAL_STUDENT_API_URL ||
        process.env.STUDENT_API_URL ||
        "http://127.0.0.1:5001/api/v1/recruiter",
    STUDENT_SERVICE_KEY: process.env.ANSOYAL_STUDENT_SERVICE_KEY ||
        process.env.STUDENT_SERVICE_SECRET ||
        "ansoyal_recruiter_service_secret_secure_key_2026",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5174",
    REDIS_URL: process.env.REDIS_URL || "",
};
