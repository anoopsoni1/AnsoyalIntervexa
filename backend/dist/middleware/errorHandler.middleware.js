"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
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
exports.errorHandler = errorHandler;
