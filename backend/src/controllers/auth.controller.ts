import { Request, Response, NextFunction } from "express";
import { authService } from "../services/AuthService.js";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, companyName, companyWebsite, designation } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
        code: "VALIDATION_ERROR",
      });
    }

    const result = await authService.register({
      name,
      email,
      password,
      companyName,
      companyWebsite,
      designation,
    });

    return res.status(201).json({
      success: true,
      message: "Recruiter account registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
        code: "VALIDATION_ERROR",
      });
    }

    const result = await authService.login(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await authService.getMe(req.user.id);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.body.refreshToken || (req.headers["x-refresh-token"] as string);
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
        code: "REFRESH_TOKEN_REQUIRED",
      });
    }

    const result = await authService.refreshAccessToken(token);
    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.id) {
      await authService.logout(req.user.id);
    }
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
