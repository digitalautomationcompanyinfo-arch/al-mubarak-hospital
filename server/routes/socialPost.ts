import { Router, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { getGeminiClient } from "../gemini";
import { requireAuth } from "./auth";
import { socialPostSchema } from "../../src/lib/validation";

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
    const parseResult = socialPostSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: parseResult.error.issues.map((i) => i.message).join(" | "),
      });
    }

    const { sourceText, platform } = parseResult.data;

    const client = getGeminiClient();
    const prompt = `
      بصفتك أخصائي شبكات التواصل الاجتماعي والإعلام الرقمي بمستشفى المبارك بكسلا (حي الجسر)، قم بصياغة منشورات جذابة وتفاعلية للغاية لمنصات التواصل الاجتماعي باللغة العربية مقتبسة ومبنية على النص التالي:
      "${sourceText}"
      
      المنصات المطلوبة: ${platform || "جميع المنصات الرئيسية (فيسبوك، إكس/تويتر، وواتساب)"}
      
      شروط الصياغة:
      - نبرة دافئة، مطمئنة، وتفاعلية تلمس قلوب مجتمع كسلا والسودان كافة.
      - توظيف الرموز التعبيرية (Emojis) الطبية والجميلة بشكل متوازن واحترافي لجعل المنشور جذاباً بصرياً.
      - استخدام الفصحى المبسطة القريبة لعامة الناس، أو المزج الراقي ببعض الكلمات السودانية اللطيفة المألوفة لتعزيز روح المودة والألفة.
      - تضمين الهاشتاغات الرائجة والمناسبة مثل: #مستشفى_المبارك #كسلا #السودان #صحة_كسلا #قسم_الإعلام_والتواصل #حي_الجسر.
      - تنظيم النص بفقرات قصيرة ومريحة للقراءة على الهواتف الذكية.
      
      يرجى إخراج المخرجات مقسمة ومنسقة بـ Markdown لتسهيل نسخها لكل منصة على حدة.
    `;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("Error in generate-social-post:", error);
    res.status(500).json({
      error: error.message || "حدث خطأ أثناء صياغة منشورات التواصل الاجتماعي",
    });
  }
});

export default router;
