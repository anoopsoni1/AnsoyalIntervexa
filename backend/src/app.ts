import express, { Express } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { ENV } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import companyRouter from "./routes/company.routes.js";
import candidateRouter from "./routes/candidate.routes.js";
import shortlistRouter from "./routes/shortlist.routes.js";
import noteRouter from "./routes/note.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";

const app: Express = express();

// Trust proxy for rate limiting headers
app.set("trust proxy", 1);

// CORS configuration
const allowedOrigins = [
  ENV.FRONTEND_URL,
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev/staging
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Global rate limiting: 120 requests per minute
const apiLimiter = rateLimit({
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
app.use("/api/auth", authRouter);
app.use("/api/company", companyRouter);
app.use("/api/candidates", candidateRouter);
app.use("/api/shortlists", shortlistRouter);
app.use("/api/notes", noteRouter);
app.use("/api/dashboard", dashboardRouter);

// Global error handler
app.use(errorHandler);

export { app };
