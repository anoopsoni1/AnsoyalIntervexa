import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { Recruiter } from "../models/Recruiter.model.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    companyId: string;
    role: string;
    name: string;
  };
}

export const authenticateRecruiter = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
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
    const secret = ENV.ACCESS_TOKEN_SECRET || ENV.JWT_SECRET || "vewb37OPcFl2gZrc1zCacjCqsKajDyHfozOG4MOhfAbuUWvj1VE6UbEe";
    const decoded = jwt.verify(token, secret) as unknown as {
      recruiterId: string;
      email: string;
      companyId: string;
      role: string;
    };

    const recruiter = await Recruiter.findById(decoded.recruiterId).select("-passwordHash");
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
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session token",
      code: "INVALID_TOKEN",
    });
  }
};
