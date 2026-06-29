import { z } from "zod";

// Feedback/Contact form schema
export const feedbackSchema = z.object({
  senderName: z
    .string()
    .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل")
    .max(100, "الاسم طويل جداً"),
  phone: z
    .string()
    .min(8, "رقم الهاتف غير صحيح")
    .max(20, "رقم الهاتف طويل جداً")
    .regex(/^[\d+\-\s()]+$/, "صيغة رقم الهاتف غير صحيحة"),
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .or(z.literal(""))
    .optional(),
  subject: z
    .string()
    .min(3, "الموضوع يجب أن يكون 3 أحرف على الأقل")
    .max(200, "الموضوع طويل جداً"),
  type: z.enum(["complaint", "inquiry", "thank", "suggestion"]),
  message: z
    .string()
    .min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل")
    .max(5000, "الرسالة طويلة جداً"),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;

// Press release generation schema
export const pressReleaseSchema = z.object({
  topic: z
    .string()
    .min(5, "العنوان يجب أن يكون 5 أحرف على الأقل")
    .max(300, "العنوان طويل جداً"),
  keyPoints: z
    .string()
    .min(10, "النقاط الأساسية يجب أن تكون 10 أحرف على الأقل")
    .max(5000, "النقاط الأساسية طويلة جداً"),
  tone: z.string().min(1, "نبرة الصياغة مطلوبة"),
});

export type PressReleaseFormData = z.infer<typeof pressReleaseSchema>;

// Social media generation schema
export const socialPostSchema = z.object({
  sourceText: z
    .string()
    .min(10, "النص يجب أن يكون 10 أحرف على الأقل")
    .max(5000, "النص طويل جداً"),
  platform: z.string().min(1, "المنصة مطلوبة"),
});

export type SocialPostFormData = z.infer<typeof socialPostSchema>;

// Health tips schema
export const healthTipsSchema = z.object({
  topic: z
    .string()
    .min(3, "الموضوع يجب أن يكون 3 أحرف على الأقل")
    .max(300, "الموضوع طويل جداً"),
  lang: z.enum(["ar", "en"]),
});

export type HealthTipsFormData = z.infer<typeof healthTipsSchema>;

// Login schema
export const loginSchema = z.object({
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .max(100, "كلمة المرور طويلة جداً"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Helper to format Zod errors for display
export function formatZodErrors(error: z.ZodError): string {
  return error.errors.map((e) => e.message).join("\n");
}

// Helper to get field-specific error
export function getFieldError(error: z.ZodError | null, field: string): string | undefined {
  if (!error) return undefined;
  const fieldError = error.errors.find((e) => e.path[0] === field);
  return fieldError?.message;
}
