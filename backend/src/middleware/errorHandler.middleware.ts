import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const code = err.code || "INTERNAL_SERVER_ERROR";

  if (statusCode >= 500) {
    console.error("[RecruiterBackend ERROR]:", err);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    code,
  });
};
