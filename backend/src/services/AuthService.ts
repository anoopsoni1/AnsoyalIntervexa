import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Recruiter, IRecruiter } from "../models/Recruiter.model.js";
import { Company, ICompany } from "../models/Company.model.js";
import { ENV } from "../config/env.js";

export interface TokenPayload {
  recruiterId: string;
  email: string;
  companyId: string;
  role: string;
}

export class AuthService {
  public generateAccessToken(recruiter: IRecruiter): string {
    const payload: TokenPayload = {
      recruiterId: recruiter._id.toString(),
      email: recruiter.email,
      companyId: recruiter.companyId.toString(),
      role: recruiter.role,
    };

    const secret = ENV.ACCESS_TOKEN_SECRET || ENV.JWT_SECRET || "vewb37OPcFl2gZrc1zCacjCqsKajDyHfozOG4MOhfAbuUWvj1VE6UbEe";
    return jwt.sign(payload, secret, {
      expiresIn: ENV.ACCESS_TOKEN_EXPIRY as any,
    });
  }

  public generateRefreshToken(recruiter: IRecruiter): string {
    const payload: TokenPayload = {
      recruiterId: recruiter._id.toString(),
      email: recruiter.email,
      companyId: recruiter.companyId.toString(),
      role: recruiter.role,
    };

    const refreshSecret = ENV.REFRESH_TOKEN_SECRET || "K4JvZ9Y8mIYB55L5Y5Uw0BT0ltYYJaRa3mtBoTqhXHjAMl28grA4kuOx31s";
    return jwt.sign(payload, refreshSecret, {
      expiresIn: ENV.REFRESH_TOKEN_EXPIRY as any,
    });
  }

  public generateToken(recruiter: IRecruiter): string {
    return this.generateAccessToken(recruiter);
  }

  public async register(data: {
    name: string;
    email: string;
    password: string;
    companyName: string;
    companyWebsite?: string;
    designation?: string;
  }) {
    const cleanEmail = data.email.toLowerCase().trim();

    const existingRecruiter = await Recruiter.findOne({ email: cleanEmail });
    if (existingRecruiter) {
      const err = new Error("A recruiter account with this email already exists");
      (err as any).statusCode = 400;
      throw err;
    }

    // Determine domain from email
    const emailDomain = cleanEmail.split("@")[1] || "company.com";

    // Find or create company
    let company = await Company.findOne({ domain: emailDomain });
    let role: "OWNER" | "RECRUITER" = "OWNER";

    if (!company) {
      company = await Company.create({
        name: data.companyName || emailDomain.split(".")[0].toUpperCase(),
        domain: emailDomain,
        website: data.companyWebsite || `https://${emailDomain}`,
        verifiedStatus: "VERIFIED",
      });
      role = "OWNER";
    } else {
      role = "RECRUITER";
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const recruiter = await Recruiter.create({
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
      expiresIn: ENV.ACCESS_TOKEN_EXPIRY,
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

  public async login(email: string, password: string) {
    const cleanEmail = email.toLowerCase().trim();

    const recruiter = await Recruiter.findOne({ email: cleanEmail }).populate("companyId");
    if (!recruiter) {
      const err = new Error("Invalid email or password");
      (err as any).statusCode = 401;
      throw err;
    }

    const isMatch = await recruiter.isPasswordCorrect(password);
    if (!isMatch) {
      const err = new Error("Invalid email or password");
      (err as any).statusCode = 401;
      throw err;
    }

    const company = recruiter.companyId as any;
    const accessToken = this.generateAccessToken(recruiter);
    const refreshToken = this.generateRefreshToken(recruiter);

    recruiter.refreshToken = refreshToken;
    await recruiter.save();

    return {
      token: accessToken,
      accessToken,
      refreshToken,
      expiresIn: ENV.ACCESS_TOKEN_EXPIRY,
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

  public async refreshAccessToken(providedRefreshToken: string) {
    if (!providedRefreshToken) {
      const err = new Error("Refresh token required");
      (err as any).statusCode = 400;
      throw err;
    }

    let decoded: TokenPayload;
    try {
      const refreshSecret = ENV.REFRESH_TOKEN_SECRET || "K4JvZ9Y8mIYB55L5Y5Uw0BT0ltYYJaRa3mtBoTqhXHjAMl28grA4kuOx31s";
      decoded = jwt.verify(providedRefreshToken, refreshSecret) as unknown as TokenPayload;
    } catch (e) {
      const err = new Error("Invalid or expired refresh token");
      (err as any).statusCode = 401;
      throw err;
    }

    const recruiter = await Recruiter.findById(decoded.recruiterId);
    if (!recruiter) {
      const err = new Error("Recruiter account not found");
      (err as any).statusCode = 404;
      throw err;
    }

    if (recruiter.refreshToken && recruiter.refreshToken !== providedRefreshToken) {
      const err = new Error("Refresh token has been revoked or rotated");
      (err as any).statusCode = 401;
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
      expiresIn: ENV.ACCESS_TOKEN_EXPIRY,
    };
  }

  public async logout(recruiterId: string) {
    if (!recruiterId) return;
    await Recruiter.findByIdAndUpdate(recruiterId, { refreshToken: "" });
  }

  public async getMe(recruiterId: string) {
    const recruiter = await Recruiter.findById(recruiterId).populate("companyId");
    if (!recruiter) {
      const err = new Error("Recruiter account not found");
      (err as any).statusCode = 404;
      throw err;
    }

    const company = recruiter.companyId as any;
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

export const authService = new AuthService();
