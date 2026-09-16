"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Recruiter_model_js_1 = require("../models/Recruiter.model.js");
const Company_model_js_1 = require("../models/Company.model.js");
const env_js_1 = require("../config/env.js");
class AuthService {
    generateAccessToken(recruiter) {
        const payload = {
            recruiterId: recruiter._id.toString(),
            email: recruiter.email,
            companyId: recruiter.companyId.toString(),
            role: recruiter.role,
        };
        return jsonwebtoken_1.default.sign(payload, env_js_1.ENV.ACCESS_TOKEN_SECRET, {
            expiresIn: env_js_1.ENV.ACCESS_TOKEN_EXPIRY,
        });
    }
    generateRefreshToken(recruiter) {
        const payload = {
            recruiterId: recruiter._id.toString(),
            email: recruiter.email,
            companyId: recruiter.companyId.toString(),
            role: recruiter.role,
        };
        return jsonwebtoken_1.default.sign(payload, env_js_1.ENV.REFRESH_TOKEN_SECRET, {
            expiresIn: env_js_1.ENV.REFRESH_TOKEN_EXPIRY,
        });
    }
    generateToken(recruiter) {
        return this.generateAccessToken(recruiter);
    }
    async register(data) {
        const cleanEmail = data.email.toLowerCase().trim();
        const existingRecruiter = await Recruiter_model_js_1.Recruiter.findOne({ email: cleanEmail });
        if (existingRecruiter) {
            const err = new Error("A recruiter account with this email already exists");
            err.statusCode = 400;
            throw err;
        }
        // Determine domain from email
        const emailDomain = cleanEmail.split("@")[1] || "company.com";
        // Find or create company
        let company = await Company_model_js_1.Company.findOne({ domain: emailDomain });
        let role = "OWNER";
        if (!company) {
            company = await Company_model_js_1.Company.create({
                name: data.companyName || emailDomain.split(".")[0].toUpperCase(),
                domain: emailDomain,
                website: data.companyWebsite || `https://${emailDomain}`,
                verifiedStatus: "VERIFIED",
            });
            role = "OWNER";
        }
        else {
            role = "RECRUITER";
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(data.password, salt);
        const recruiter = await Recruiter_model_js_1.Recruiter.create({
            name: data.name.trim(),
            email: cleanEmail,
            passwordHash,
            companyId: company._id,
            role,
            designation: data.designation || "Talent Acquisition Specialist",
            isEmailVerified: true,
        });
        const accessToken = this.generateAccessToken(recruiter);
        const refreshToken = this.generateRefreshToken(recruiter);
        recruiter.refreshToken = refreshToken;
        await recruiter.save();
        return {
            token: accessToken,
            accessToken,
            refreshToken,
            expiresIn: env_js_1.ENV.ACCESS_TOKEN_EXPIRY,
            recruiter: {
                id: recruiter._id.toString(),
                name: recruiter.name,
                email: recruiter.email,
                companyId: company._id.toString(),
                role: recruiter.role,
                designation: recruiter.designation,
                permissions: recruiter.permissions,
            },
            company: {
                id: company._id.toString(),
                name: company.name,
                domain: company.domain,
                verifiedStatus: company.verifiedStatus,
            },
        };
    }
    async login(email, password) {
        const cleanEmail = email.toLowerCase().trim();
        const recruiter = await Recruiter_model_js_1.Recruiter.findOne({ email: cleanEmail }).populate("companyId");
        if (!recruiter) {
            const err = new Error("Invalid email or password");
            err.statusCode = 401;
            throw err;
        }
        const isMatch = await recruiter.isPasswordCorrect(password);
        if (!isMatch) {
            const err = new Error("Invalid email or password");
            err.statusCode = 401;
            throw err;
        }
        const company = recruiter.companyId;
        const accessToken = this.generateAccessToken(recruiter);
        const refreshToken = this.generateRefreshToken(recruiter);
        recruiter.refreshToken = refreshToken;
        await recruiter.save();
        return {
            token: accessToken,
            accessToken,
            refreshToken,
            expiresIn: env_js_1.ENV.ACCESS_TOKEN_EXPIRY,
            recruiter: {
                id: recruiter._id.toString(),
                name: recruiter.name,
                email: recruiter.email,
                companyId: company?._id?.toString() || recruiter.companyId.toString(),
                role: recruiter.role,
                designation: recruiter.designation,
                permissions: recruiter.permissions,
            },
            company: company
                ? {
                    id: company._id.toString(),
                    name: company.name,
                    domain: company.domain,
                    verifiedStatus: company.verifiedStatus,
                }
                : null,
        };
    }
    async refreshAccessToken(providedRefreshToken) {
        if (!providedRefreshToken) {
            const err = new Error("Refresh token required");
            err.statusCode = 400;
            throw err;
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(providedRefreshToken, env_js_1.ENV.REFRESH_TOKEN_SECRET);
        }
        catch (e) {
            const err = new Error("Invalid or expired refresh token");
            err.statusCode = 401;
            throw err;
        }
        const recruiter = await Recruiter_model_js_1.Recruiter.findById(decoded.recruiterId);
        if (!recruiter) {
            const err = new Error("Recruiter account not found");
            err.statusCode = 404;
            throw err;
        }
        if (recruiter.refreshToken && recruiter.refreshToken !== providedRefreshToken) {
            const err = new Error("Refresh token has been revoked or rotated");
            err.statusCode = 401;
            throw err;
        }
        const newAccessToken = this.generateAccessToken(recruiter);
        const newRefreshToken = this.generateRefreshToken(recruiter);
        recruiter.refreshToken = newRefreshToken;
        await recruiter.save();
        return {
            token: newAccessToken,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresIn: env_js_1.ENV.ACCESS_TOKEN_EXPIRY,
        };
    }
    async logout(recruiterId) {
        if (!recruiterId)
            return;
        await Recruiter_model_js_1.Recruiter.findByIdAndUpdate(recruiterId, { refreshToken: "" });
    }
    async getMe(recruiterId) {
        const recruiter = await Recruiter_model_js_1.Recruiter.findById(recruiterId).populate("companyId");
        if (!recruiter) {
            const err = new Error("Recruiter account not found");
            err.statusCode = 404;
            throw err;
        }
        const company = recruiter.companyId;
        return {
            recruiter: {
                id: recruiter._id.toString(),
                name: recruiter.name,
                email: recruiter.email,
                companyId: company?._id?.toString() || recruiter.companyId.toString(),
                role: recruiter.role,
                designation: recruiter.designation,
                permissions: recruiter.permissions,
            },
            company: company
                ? {
                    id: company._id.toString(),
                    name: company.name,
                    domain: company.domain,
                    verifiedStatus: company.verifiedStatus,
                    location: company.location,
                    industry: company.industry,
                    size: company.size,
                }
                : null,
        };
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
