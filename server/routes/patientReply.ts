import { Router, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { getGeminiClient } from "../gemini";
import { requireAuth } from "./auth";

const router = Router();

const patientReplyInputSchema = z.object({
  inquiryText: z.string().min(5, "نص الرسالة قصير جداً").max(5000, "نص الرسالة طويل جداً"),
  type: z.string().optional(),
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "تم تجاوز الحد الأقصى لصياغة الردود بالذكاء الاصطناعي. يرجى التريث قليلاً." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", requireAuth, aiLimiter, async (req: Request, res: Response) => {
  try {
    const parseResult = patientReplyInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: parseResult.error.issues.map((i) => i.message).join(" | "),
      });
    }

    const { inquiryText, type } = parseResult.data;

    const client = getGeminiClient();
    const prompt = `
      أنت مستشار العلاقات العامة والردود بقسم التواصل والإعلام بمستشفى المبارك في كسلا، السودان.
      تلقينا الرسالة أو التعليق التالي من مراجع أو مريض عبر قنواتنا الرقمية:
      "${inquiryText}"
      
      تصنيف الرسالة: ${type || "عام"} (سواء كانت شكوى، استفسار عن عيادة، شكر وتقدير، أو اقتراح).
      
      المطلوب صياغة رد رسمي واحترافي يحمل أعلى درجات اللباقة والتعاطف وحل المشكلات:
      1. ابدأ بتحية ودية تليق بـ "مستشفى المبارك - قسم التواصل والإعلام".
      2. أظهر تفهم المستشفى الكامل واهتمامه البالغ برسالة المراجع.
      3. إذا كانت الرسالة "شكوى": قدم اعتذاراً مهنياً مهذباً، وأكد بوضوح أن صحة المرضى وراحتهم هما المعيار الأول للمستشفى، واطلب منه بلطف إما مراجعة مكتب الإعلام مباشرة بحي الجسر، أو التواصل مع رقم العلاقات العامة لتسوية الأمر وحل المشكلة فوراً بشكل شخصي.
      4. إذا كانت الرسالة "استفسار": أجب بطريقة واضحة ووعد بتقديم التوجيه والمساعدة الكاملة له وتزويده بالمعلومات.
      5. إذا كانت الرسالة "شكر وتقدير": عبر عن الامتنان الكبير له وأكد أن ثقة أهالي كسلا الكرام هي الحافز الأكبر لجميع كوادرنا الطبية والإدارية.
      6. قدم نسختين من الرد:
         - النسخة الأولى: رد رسمي وافٍ ومطول للبريد الإلكتروني أو الرسائل الرسمية.
         - النسخة الثانية: رد ودي وسريع ومختصر لرسائل الواتساب أو منصات التواصل الاجتماعي.
         
      يرجى إخراج الردود بتنسيق Markdown أنيق وواضح جداً باللغة العربية الفصحى.
    `;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("Error in suggest-patient-reply:", error);
    res.status(500).json({
      error: error.message || "حدث خطأ أثناء صياغة الرد على المراجع",
    });
  }
});

export default router;
