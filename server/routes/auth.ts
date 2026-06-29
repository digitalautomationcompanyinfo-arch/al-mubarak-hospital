import { Router, Request, Response } from "express";
import rateLimit from "express-rate-limit";

const router = Router();

// Demo password from env or fallback to "1234"
const DEMO_PASSWORD = process.env.STAFF_PASSWORD || "1234";

// Simple in-memory token store (for demo purposes)
const validTokens = new Set<string>();

function generateToken(): string {
  const token = `mubarak_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  validTokens.add(token);
  // Token expires after 2 hours
  setTimeout(() => validTokens.delete(token), 2 * 60 * 60 * 1000);
  return token;
}

// Rate limiting: max 5 login attempts per IP per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: "تم تجاوز الحد الأقصى لمحاولات تسجيل الدخول. يرجى المحاولة بعد 15 دقيقة.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login endpoint
router.post("/login", loginLimiter, (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      error: "كلمة المرور مطلوبة",
    });
  }

  if (password === DEMO_PASSWORD) {
    const token = generateToken();
    return res.json({
      success: true,
      token,
      message: "تم تسجيل الدخول بنجاح",
    });
  }

  return res.status(401).json({
    success: false,
    error: "كلمة المرور غير صحيحة",
  });
});

// Verify token endpoint
router.post("/verify", (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token || !validTokens.has(token)) {
    return res.status(401).json({
      success: false,
      valid: false,
    });
  }

  return res.json({
    success: true,
    valid: true,
  });
});

// Logout endpoint
router.post("/logout", (req: Request, res: Response) => {
  const { token } = req.body;

  if (token) {
    validTokens.delete(token);
  }

  return res.json({
    success: true,
    message: "تم تسجيل الخروج بنجاح",
  });
});

export default router;
