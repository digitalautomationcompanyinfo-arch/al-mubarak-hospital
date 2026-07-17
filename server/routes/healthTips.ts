import { Router, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { getGeminiClient, Type } from "../gemini";
import { healthTipsSchema } from "../../src/lib/validation";

const router = Router();

const healthTipsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "تم تجاوز الحد الأقصى للاستفسارات الطبية التوعوية. يرجى المحاولة بعد قليل." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Fallback tips when Gemini is unavailable
const fallbackTipsAr = {
  title: "الوقاية من حمى الضنك والملاريا بكسلا",
  category: "الأمراض المعدية والوقائية",
  content: `1. **تغطية مصادر المياه**: احرص على إغلاق وتغطية الخزانات وأواني حفظ المياه المنزلية بإحكام لمنع توالد البعوض.
2. **استخدام الناموسيات المشبعة**: نم دائماً تحت الناموسية المشبعة بالمنطقة المخصصة، خاصة الأطفال والحوامل.
3. **التخلص من المياه الراكدة**: قم بتصريف وتجفيف أي تجمعات للمياه الراكدة حول المنزل أو في حي الجسر فوراً.
4. **استخدام طارد الحشرات**: استخدم الكريمات الطاردة والملابس الطويلة عند الخروج في أوقات نشاط البعوض (الفجر والغروب).`,
  kassalaAdvice:
    "نظراً لموقع حي الجسر وقربه من مجرى نهر القاش الموسمي بكسلا، نوصي أهلنا الكرام بمضاعفة إجراءات الوقاية وتصريف برك المياه بالتنسيق مع حملة التوعية الجارية بالمستشفى.",
};

const fallbackTipsEn = {
  title: "Dengue & Malaria Prevention in Kassala",
  category: "Infectious & Preventive Diseases",
  content: `1. **Cover Water Containers**: Keep all household water storage containers tightly covered to prevent mosquito breeding.
2. **Use Insecticide-Treated Nets**: Ensure you and your children sleep under treated mosquito nets at all times.
3. **Drain Standing Water**: Promptly dry or drain any puddles or standing water in and around your yard in Al-Gisr.
4. **Wear Protective Clothing**: Wear long-sleeved clothes and use insect repellents during peak mosquito activity hours (dawn and dusk).`,
  kassalaAdvice:
    "Due to Al-Gisr's proximity to the seasonal Gash River in Kassala, we strongly urge residents to double down on vector control and coordinate with our hospital's ongoing campaigns.",
};

router.post("/", healthTipsLimiter, async (req: Request, res: Response) => {
  try {
    const parseResult = healthTipsSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: parseResult.error.issues.map((i) => i.message).join(" | "),
      });
    }

    const { topic, lang } = parseResult.data;

    const client = getGeminiClient();
    const prompt = `
      You are a senior Public Health Consultant at Al-Mubarak Specialized Hospital in Kassala, Sudan (located in the historic Al-Gisr district).
      Provide highly professional, accurate, and practical health and preventive guidelines on the following topic: "${topic}".
      
      The language of the response MUST be: ${lang === "ar" ? "Arabic (العربية الفصحى)" : "English"}.
      
      Tailor the advice, warnings, and guidelines to the local context of Kassala State, Sudan if relevant (e.g., seasonal rain, dust storms, water hygiene near River Gash, vector control for mosquitoes transmitting Malaria or Dengue, dietary advice using local ingredients, or heat safety during extreme summer temperature).
      
      Provide the response structured EXACTLY in JSON with these fields:
      - "title": A brief, engaging title for the health tip or awareness campaign.
      - "category": The main medical/health category (e.g., Preventive Medicine, Maternal & Child Health, Infectious Diseases, Chronic Disease Care, First Aid).
      - "content": Solid, actionable preventive points or paragraphs in Markdown format.
      - "kassalaAdvice": Special health guidance specifically customized for Kassala citizens or Sudanese environmental context.
    `;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Engaging short title",
            },
            category: {
              type: Type.STRING,
              description: "Category of the health tip",
            },
            content: {
              type: Type.STRING,
              description: "Actionable details/points in Markdown format",
            },
            kassalaAdvice: {
              type: Type.STRING,
              description:
                "Specific advice tailored to Kassala/Sudanese context",
            },
          },
          required: ["title", "category", "content", "kassalaAdvice"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response generated");
    }

    const parsedResult = JSON.parse(response.text.trim());
    res.json(parsedResult);
  } catch (error: any) {
    console.error("Error in health-tips api:", error);

    // Return professional offline fallback if Gemini client or API key fails
    const finalFallback =
      req.body.lang === "ar" ? fallbackTipsAr : fallbackTipsEn;
    res.json(finalFallback);
  }
});

export default router;
