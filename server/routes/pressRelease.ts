import { Router, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { getGeminiClient } from "../gemini";
import { requireAuth } from "./auth";
import { pressReleaseSchema } from "../../src/lib/validation";

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { error: "تم تجاوز الحد الأقصى لاستخدام الذكاء الاصطناعي. يرجى الانتظار دقيقتين." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", requireAuth, aiLimiter, async (req: Request, res: Response) => {
  try {
    const parseResult = pressReleaseSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: parseResult.error.issues.map((i) => i.message).join(" | "),
      });
    }

    const { topic, keyPoints, tone } = parseResult.data;

    const client = getGeminiClient();
    const prompt = `
      أنت رئيس قسم الإعلام والتواصل في "مستشفى المبارك" في مدينة كسلا (حي الجسر)، السودان.
      اكتب بياناً صحفياً رسمياً ومحترفاً للغاية باللغة العربية حول الموضوع التالي: "${topic}".
      
      النقاط الأساسية التي يجب تضمينها والتركيز عليها:
      ${keyPoints || "اكتب بياناً صحفياً شاملاً ومحترفاً يغطي الجوانب الطبية والإنسانية لهذا الخبر."}
      
      نبرة الصوت المطلوبة: ${tone || "رسمية، طبية، ووقورة مفعمة بالأمل"}
      
      شروط الصياغة الصحفية المحترفة:
      1. عنوان رئيسي جذاب ومثير للاهتمام ومصاغ بأسلوب صحفي رفيع.
      2. فقرة افتتاحية قوية جداً تبدأ بمصدر وتاريخ الخبر: (كسلا، السودان - [تاريخ اليوم]).
      3. تفصيل الخبر في جسم البيان بأسلوب سردي يجذب وكالات الأنباء والصحف المحلية والإقليمية، مع تسليط الضوء على رسالة مستشفى المبارك ودوره الريادي في تقديم رعاية صحية متميزة لأهالي ولاية كسلا وحي الجسر العريق.
      4. اقتباس افتراضي ملهم ومعبر من المدير العام للمستشفى أو رئيس قسم الإعلام والتواصل، يوضح الفلسفة والالتزام وراء هذا الإنجاز أو الحدث.
      5. خاتمة احترافية تلخص الخبر.
      6. إدراج فقرة تعريفية رسمية عن مستشفى المبارك بكسلا، حي الجسر (Boilerplate) في نهاية البيان.
      7. تذييل البيان بمعلومات الاتصال الافتراضية لقسم الإعلام والتواصل (بريد إلكتروني، هاتف، وعنوان المستشفى بحي الجسر - كسلا).
      
      يرجى إخراج البيان بلغة عربية فصحى بليغة وخالية من الأخطاء النحوية والإملائية وتنسيقها بشكل Markdown أنيق وجميل جداً وجاهز للنسخ والنشر المباشر.
    `;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("Error in generate-press-release:", error);
    res.status(500).json({
      error: error.message || "حدث خطأ أثناء توليد البيان الصحفي بالذكاء الاصطناعي",
    });
  }
});

export default router;
