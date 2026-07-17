import express from "express";
import dotenv from "dotenv";
import pressReleaseRouter from "../server/routes/pressRelease";
import socialPostRouter from "../server/routes/socialPost";
import patientReplyRouter from "../server/routes/patientReply";
import healthTipsRouter from "../server/routes/healthTips";
import authRouter from "../server/routes/auth";

dotenv.config();

const app = express();

// Security Headers Middleware
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

// Limit JSON payload size to 100kb
app.use(express.json({ limit: "100kb" }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI-powered endpoints
app.use("/api/generate-press-release", pressReleaseRouter);
app.use("/api/generate-social-post", socialPostRouter);
app.use("/api/suggest-patient-reply", patientReplyRouter);
app.use("/api/health-tips", healthTipsRouter);

// Authentication
app.use("/api/auth", authRouter);

// For Vercel serverless: export the Express app
export default app;
