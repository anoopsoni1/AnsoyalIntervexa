"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.getMe = exports.login = exports.register = void 0;
const AuthService_js_1 = require("../services/AuthService.js");
const register = async (req, res, next) => {
    try {
        const { name, email, password, companyName, companyWebsite, designation } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
                code: "VALIDATION_ERROR",
            });
        }
        const result = await AuthService_js_1.authService.register({
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
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
                code: "VALIDATION_ERROR",
            });
        }
        const result = await AuthService_js_1.authService.login(email, password);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const result = await AuthService_js_1.authService.getMe(req.user.id);
        return res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
const refreshToken = async (req, res, next) => {
    try {
        const token = req.body.refreshToken || req.headers["x-refresh-token"];
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Refresh token is required",
                code: "REFRESH_TOKEN_REQUIRED",
            });
        }
        const result = await AuthService_js_1.authService.refreshAccessToken(token);
        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res, next) => {
    try {
        if (req.user?.id) {
            await AuthService_js_1.authService.logout(req.user.id);
        }
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
