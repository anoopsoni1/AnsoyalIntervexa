"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_js_1 = require("./config/env.js");
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const company_routes_js_1 = __importDefault(require("./routes/company.routes.js"));
const candidate_routes_js_1 = __importDefault(require("./routes/candidate.routes.js"));
const shortlist_routes_js_1 = __importDefault(require("./routes/shortlist.routes.js"));
const note_routes_js_1 = __importDefault(require("./routes/note.routes.js"));
const dashboard_routes_js_1 = __importDefault(require("./routes/dashboard.routes.js"));
const errorHandler_middleware_js_1 = require("./middleware/errorHandler.middleware.js");
const app = (0, express_1.default)();
exports.app = app;
// Trust proxy for rate limiting headers
app.set("trust proxy", 1);
// CORS configuration
const allowedOrigins = [
    env_js_1.ENV.FRONTEND_URL,
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5173",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(null, true); // Permissive in dev/staging
        }
    },
    credentials: true,
}));
app.use(express_1.default.json({ limit: "2mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// Global rate limiting: 120 requests per minute
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 120,
    message: {
        success: false,
        message: "Rate limit exceeded. Please slow down your requests.",
        code: "RATE_LIMIT_EXCEEDED",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/", apiLimiter);
// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "ansoyal-recruiter-platform-backend",
        timestamp: new Date().toISOString(),
    });
});
// Mount domain routes
app.use("/api/auth", auth_routes_js_1.default);
app.use("/api/company", company_routes_js_1.default);
app.use("/api/candidates", candidate_routes_js_1.default);
app.use("/api/shortlists", shortlist_routes_js_1.default);
app.use("/api/notes", note_routes_js_1.default);
app.use("/api/dashboard", dashboard_routes_js_1.default);
// Global error handler
app.use(errorHandler_middleware_js_1.errorHandler);
