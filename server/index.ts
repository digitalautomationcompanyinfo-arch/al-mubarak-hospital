import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import pressReleaseRouter from "./routes/pressRelease";
import socialPostRouter from "./routes/socialPost";
import patientReplyRouter from "./routes/patientReply";
import healthTipsRouter from "./routes/healthTips";
import authRouter from "./routes/auth";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = process.env.PORT || 3000;

  // --- API Routes ---

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

  // --- Serve Frontend Application ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Al-Mubarak Hospital server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
