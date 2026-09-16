"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateRecruiter = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../config/env.js");
const Recruiter_model_js_1 = require("../models/Recruiter.model.js");
const authenticateRecruiter = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authorization token required",
            code: "AUTH_TOKEN_REQUIRED",
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        const secret = env_js_1.ENV.ACCESS_TOKEN_SECRET || env_js_1.ENV.JWT_SECRET || "vewb37OPcFl2gZrc1zCacjCqsKajDyHfozOG4MOhfAbuUWvj1VE6UbEe";
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const recruiter = await Recruiter_model_js_1.Recruiter.findById(decoded.recruiterId).select("-passwordHash");
        if (!recruiter) {
            return res.status(401).json({
                success: false,
                message: "Recruiter account not found or suspended",
                code: "RECRUITER_NOT_FOUND",
            });
        }
        req.user = {
            id: recruiter._id.toString(),
            email: recruiter.email,
            companyId: recruiter.companyId.toString(),
            role: recruiter.role,
            name: recruiter.name,
        };
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired session token",
            code: "INVALID_TOKEN",
        });
    }
};
exports.authenticateRecruiter = authenticateRecruiter;
