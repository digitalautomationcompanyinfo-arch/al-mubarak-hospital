import React, { useState } from "react";
import toast from "react-hot-toast";
import { NewsArticle, Department, PatientFeedback } from "../types";
import DynamicIcon, { IconName } from "./DynamicIcon";
import { translations } from "../data/translations";
import { feedbackSchema } from "../lib/validation";

interface PublicPortalProps {
  news: NewsArticle[];
  departments: Department[];
  onAddFeedback: (feedback: Omit<PatientFeedback, "id" | "date" | "status">) => void;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  lang: "ar" | "en";
}

export default function PublicPortal({
  news,
  departments,
  onAddFeedback,
  activeSubTab,
  setActiveSubTab,
  lang
}: PublicPortalProps) {
  const t = translations[lang];

  // Feedback form state
  const [senderName, setSenderName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState<PatientFeedback["type"]>("inquiry");
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Search & Filter state for News
  const [newsSearch, setNewsSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Selected news modal state
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);

  // Health Awareness section states
  const [healthTopic, setHealthTopic] = useState("");
  const [generatedTip, setGeneratedTip] = useState<{ title: string; category: string; content: string; kassalaAdvice: string } | null>(null);
  const [isGeneratingTip, setIsGeneratingTip] = useState(false);
  const [activeCuratedIndex, setActiveCuratedIndex] = useState(0);

  const curatedTips = [
    {
      id: "tip-1",
      title: lang === "ar" ? "الوقاية من الملاريا وحمى الضنك" : "Malaria & Dengue Prevention",
      icon: "AlertCircle",
      category: lang === "ar" ? "طب وقائي" : "Preventive Medicine",
      desc: lang === "ar" 
        ? "تعتبر الملاريا وحمى الضنك من التحديات الصحية الموسمية بكسلا، وتنتقل عبر لدغات البعوض الحامل للمرض."
        : "Malaria and Dengue are seasonal health challenges in Kassala, transmitted by carrier mosquito bites.",
      bullets: lang === "ar" ? [
        "تفريغ وتجفيف أي مياه راكدة حول المنازل فوراً لمنع توالد اليرقات.",
        "النوم الدائم تحت الناموسيات المشبعة، خصوصاً للأطفال الصغار والحوامل.",
        "تركيب شبكات سلكية ضيقة على النوافذ لمنع دخول الحشرات طوال اليوم.",
        "استخدام الدهانات والمستحضرات الطاردة للبعوض على الأجزاء المكشوفة من الجسم."
      ] : [
        "Drain and dry any stagnant water around houses immediately to prevent larval breeding.",
        "Always sleep under insecticide-treated mosquito nets, especially young children and pregnant women.",
        "Install fine mesh wire screens on windows to block insects day and night.",
        "Use insect repellent creams on exposed skin during high-activity hours."
      ],
      kassalaAdvice: lang === "ar"
        ? "نظراً لمجاورة حي الجسر لمجرى نهر القاش، تتضاعف أهمية ردم المستنقعات المنزلية والتعاون مع فرق الرش والتعقيم التابعة لوزارة الصحة والمستشفى."
        : "Due to Al-Gisr's proximity to the Gash Riverbed, household swamp clearance and collaboration with spray teams are crucial."
    },
    {
      id: "tip-2",
      title: lang === "ar" ? "سلامة مياه الشرب والوقاية من النزلات" : "Drinking Water Safety & Hygiene",
      icon: "Droplet",
      category: lang === "ar" ? "صحة البيئة" : "Environmental Health",
      desc: lang === "ar"
        ? "الوقاية من أمراض الكوليرا والاسهالات المائية تبدأ من الحصول على مياه شرب نظيفة ومغسولة بعناية."
        : "Prevention of Cholera and waterborne diarrheal diseases starts with clean, sterilized drinking water.",
      bullets: lang === "ar" ? [
        "غلي مياه الشرب جيداً أو إضافة حبوب الكلور المعقمة الموزعة مجاناً بصيدلية المستشفى.",
        "غسل الأيدي بالصابون جيداً قبل إعداد الطعام وققبل تناوله وبعد قضاء الحاجة.",
        "غسل الخضروات والفواكه الطازجة بمياه نظيفة ومعقمة مضافاً إليها قطرات الليمون أو الخل.",
        "تجنب الأغذية المكشوفة أو المشروبات الباردة من الباعة المتجولين لضمان السلامة التامة."
      ] : [
        "Boil drinking water or add chlorine tablets distributed for free at the hospital pharmacy.",
        "Wash hands thoroughly with soap before food preparation, eating, and after washroom use.",
        "Clean fresh vegetables and fruits with sterile water mixed with vinegar or lemon drops.",
        "Avoid uncovered street foods and open beverages to ensure complete gastrointestinal safety."
      ],
      kassalaAdvice: lang === "ar"
        ? "تتوفر حبوب تعقيم المياه والمنشورات الوقائية مجاناً لدى مكتب العلاقات العامة والخدمة الاجتماعية بمستشفى المبارك على مدار الساعة."
        : "Water purification tablets and educational flyers are available free of charge at the Al-Mubarak social service desk 24/7."
    },
    {
      id: "tip-3",
      title: lang === "ar" ? "تغذية الرضع والرضاعة الطبيعية" : "Infant Nutrition & Breastfeeding",
      icon: "Heart",
      category: lang === "ar" ? "صحة الطفل والأمومة" : "Maternal & Child Health",
      desc: lang === "ar"
        ? "تعتبر الرضاعة الطبيعية المطلقة في الستة أشهر الأولى خط الدفاع الأول لبناء مناعة طفلك ضد النزلات المعوية."
        : "Exclusive breastfeeding during the first six months acts as the primary shield for infant gastrointestinal immunity.",
      bullets: lang === "ar" ? [
        "الرضاعة الطبيعية المطلقة تحمي الرضيع من مخاطر تلوث الحليب الصناعي والمياه غير المعقمة.",
        "إدخال التغذية التكميلية الغنية بالحديد والفيتامينات (كالبطاطس المهروسة وعصيدة الدخن) بعد الشهر السادس.",
        "الالتزام الصارم بجدول التحصينات الموسع بمراكز الرعاية الصحية الأولية بالولاية.",
        "الحفاظ على نظافة صدر الأم وأدوات تغذية الطفل وغسل اليدين باستمرار."
      ] : [
        "Exclusive breastfeeding shields infants from formula contamination risks and unsterilized water.",
        "Introduce iron and vitamin-rich supplementary purees (like mashed potatoes/millet porridge) post-6 months.",
        "Strictly adhere to the expanded immunization schedule at the state's primary clinics.",
        "Maintain absolute hygiene of maternal breast and baby utensils with regular handwashing."
      ],
      kassalaAdvice: lang === "ar"
        ? "يقدم قسم الأطفال والاستشارات الأسرية بمستشفى المبارك جلسات توعوية مجانية للأمهات الجدد كل يوم سبت وإثنين بمقر عيادات الأطفال."
        : "Al-Mubarak Pediatric and Family Consulting wing hosts free mother care support sessions every Saturday and Monday."
    },
    {
      id: "tip-4",
      title: lang === "ar" ? "الوقاية من ضربات الشمس والإجهاد الحراري" : "Heat Stroke & Hydration Safety",
      icon: "Sun",
      category: lang === "ar" ? "طب الطوارئ" : "Emergency Medicine",
      desc: lang === "ar"
        ? "تشهد ولاية كسلا درجات حرارة مرتفعة في شهور الصيف، مما يتطلب الحذر الشديد لتفادي الإجهاد الحراري والجفاف."
        : "Kassala experiences extremely high temperatures during summer months, requiring extreme caution against heat stress.",
      bullets: lang === "ar" ? [
        "شرب كميات وفيرة من المياه النقية والسوائل الطبيعية (لا تقل عن 3 لترات يومياً) دون انتظار الشعور بالعطش.",
        "تجنب التعرض المباشر لأشعة الشمس في أوقات الذروة (من 11 صباحاً وحتى 4 عصراً).",
        "ارتداء ملابس قطنية خفيفة ذات ألوان فاتحة لتعكس الحرارة وتسمح بتهوية الجسم.",
        "عند الشعور بدوار أو صداع شديد، يجب الانتقال فوراً لظل بارد ومسح الجسم بقطعة مبللة بالماء الفاتر."
      ] : [
        "Drink generous amounts of clean water and natural fluids (at least 3 liters daily) before feeling thirsty.",
        "Avoid direct midday sun exposure during peak hours (11:00 AM to 4:00 PM).",
        "Wear light, loose-fitting, pastel-colored cotton clothing to reflect heat and ventilate the body.",
        "If experiencing dizziness or heavy headache, rest in a cool shade and wipe skin with lukewarm damp cloths."
      ],
      kassalaAdvice: lang === "ar"
        ? "قسم الحوادث وطوارئ مستشفى المبارك مجهز بوحدة رعاية مخصصة لعلاج حالات الإجهاد الحراري وضربات الشمس تحت إشراف اختصاصيين على مدار 24 ساعة."
        : "Al-Mubarak Emergency Department is equipped with a specialized heat stroke and rehydration care unit supervised 24/7."
    }
  ];

  const handleFetchAiTip = async (topicToSearch?: string) => {
    const targetTopic = topicToSearch || healthTopic;
    if (!targetTopic.trim()) return;

    setIsGeneratingTip(true);
    setGeneratedTip(null);

    try {
      const response = await fetch("/api/health-tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: targetTopic, lang })
      });
      const data = await response.json();
      setGeneratedTip({
        title: data.title || targetTopic,
        category: data.category || (lang === "ar" ? "إرشاد صحي بالذكاء الاصطناعي" : "AI Health Guidance"),
        content: data.content || "",
        kassalaAdvice: data.kassalaAdvice || ""
      });
    } catch (error) {
      console.error("Failed to fetch health tip:", error);
      toast.error(
        lang === "ar"
          ? "⚠️ تعذر الاتصال بمساعد الذكاء الاصطناعي. يرجى المحاولة لاحقاً."
          : "⚠️ Could not reach the AI health assistant. Please try again later."
      );
    } finally {
      setIsGeneratingTip(false);
    }
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const formData = {
      senderName: senderName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      subject: subject.trim(),
      type,
      message: message.trim(),
    };

    const result = feedbackSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setFormErrors(fieldErrors);
      toast.error(
        lang === "ar"
          ? "يرجى تصحيح الأخطاء في النموذج قبل الإرسال."
          : "Please fix the form errors before submitting."
      );
      return;
    }

    onAddFeedback({
      senderName: result.data.senderName,
      phone: result.data.phone,
      email: result.data.email || "",
      subject: result.data.subject,
      type: result.data.type,
      message: result.data.message,
    });

    // Reset form
    setSenderName("");
    setPhone("");
    setEmail("");
    setSubject("");
    setMessage("");
    setFormErrors({});

    toast.success(
      lang === "ar"
        ? "✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً."
        : "✅ Your message was sent successfully! We'll be in touch soon."
    );
  };

  // Filtered news
  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(newsSearch.toLowerCase()) ||
      item.content.toLowerCase().includes(newsSearch.toLowerCase());
    
    // Map categories depending on current language filters
    let matchesCategory = selectedCategory === "all";
    if (!matchesCategory) {
      if (lang === "ar") {
        matchesCategory = item.category === selectedCategory;
      } else {
        // Map English filters back to Arabic categories for internal data matching
        const categoryMap: Record<string, string> = {
          "Press Release": "بيان صحفي",
          "Awareness Campaign": "حملة توعوية",
          "Hospital News": "أخبار المستشفى",
          "Official Notice": "إعلان رسمي"
        };
        matchesCategory = item.category === categoryMap[selectedCategory];
      }
    }
    return matchesSearch && matchesCategory;
  });

  const alignClass = "text-start";

  return (
    <div className="w-full">
      
      {/* 1. HOME VIEW */}
      {activeSubTab === "home" && (
        <div className="space-y-12 animate-fade-in">
          
          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-burgundy-950 via-burgundy-850 to-[#3D0C0C] text-white p-8 md:p-16 shadow-xl border border-burgundy-900/10">
            {/* Elegant Geometric Background Accents */}
            <div className="absolute -bottom-20 -right-20 w-96 h-96 border-[40px] border-white/[0.03] rounded-full pointer-events-none"></div>
            <div className="absolute top-10 right-10 w-20 h-20 border border-white/10 rounded-3xl pointer-events-none rotate-12"></div>
            <div className="absolute right-12 bottom-6 text-white/[0.02] pointer-events-none select-none font-sans font-black text-7xl md:text-9xl hidden lg:block">
              {lang === "ar" ? "مستشفى المبارك" : "AL-MUBARAK"}
            </div>

            <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-center relative z-10">
              
              {/* Text Column */}
              <div className="lg:col-span-7 space-y-6">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-burgundy-300">
                  <span className="w-2 h-2 rounded-full bg-burgundy-600 animate-pulse"></span>
                  {t.heroWelcome}
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                  {t.heroTitle}
                </h1>
                <p className="text-sm md:text-lg text-slate-200/80 leading-relaxed font-light">
                  {t.heroDesc}
                </p>
                
                <div className="flex flex-wrap gap-3.5 pt-4">
                  <button
                    onClick={() => setActiveSubTab("contact")}
                    className="px-6 py-3 bg-white hover:bg-burgundy-100 text-burgundy-850 font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer text-xs md:text-sm"
                  >
                    <DynamicIcon name="MessageSquare" size={16} />
                    <span>{t.heroContactBtn}</span>
                  </button>
                  <button
                    onClick={() => setActiveSubTab("news")}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer text-xs md:text-sm"
                  >
                    <DynamicIcon name="Megaphone" size={16} />
                    <span>{t.heroNewsBtn}</span>
                  </button>
                </div>
              </div>

              {/* Image Column */}
              <div className="lg:col-span-5 relative w-full h-full min-h-[280px] md:min-h-[340px] flex items-center justify-center">
                {/* Decorative glow behind image */}
                <div className="absolute inset-0 bg-gradient-to-tr from-burgundy-600/20 to-burgundy-600/5 blur-3xl rounded-full"></div>
                
                <div className="relative group overflow-hidden rounded-2xl border-4 border-white/10 shadow-2xl transition-transform duration-500 hover:scale-[1.02] w-full max-w-[420px] aspect-[4/3] bg-burgundy-950/40">
                  <img
                    src="https://images.unsplash.com/photo-1586773860418-d3b3202815e1?auto=format&fit=crop&w=800&q=80"
                    alt={lang === "ar" ? "مستشفى المبارك التخصصي" : "Al-Mubarak Specialized Hospital"}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle vignette/gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/80 via-transparent to-transparent"></div>
                  
                  {/* Glassmorphic overlay badge inside image */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-white text-burgundy-850 rounded-lg shadow-sm shrink-0">
                      <DynamicIcon name="Building" size={16} />
                    </div>
                    <div className={`space-y-0.5 ${alignClass}`}>
                      <p className="text-[10px] font-bold text-burgundy-500 tracking-wider">
                        {lang === "ar" ? "رعاية طبية فائقة" : "PREMIUM CARE"}
                      </p>
                      <p className="text-xs font-bold text-white">
                        {lang === "ar" ? "حي الجسر، ولاية كسلا" : "Al-Gisr, Kassala State"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Quick Stats Bar */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: t.homeStat1Label, val: t.homeStat1Val, bg: "bg-white border border-slate-100 shadow-sm", txtColor: "text-burgundy-850", icon: "Users", iconBg: "bg-burgundy-100 text-burgundy-800" },
              { label: t.homeStat2Label, val: t.homeStat2Val, bg: "bg-gradient-to-tr from-burgundy-900 to-burgundy-800 text-white shadow-md shadow-burgundy-900/10", txtColor: "text-white", icon: "Building", iconBg: "bg-white/10 text-white" },
              { label: t.homeStat3Label, val: t.homeStat3Val, bg: "bg-white border border-slate-150 shadow-sm", txtColor: "text-slate-800", icon: "Activity", iconBg: "bg-burgundy-100 text-burgundy-700" },
              { label: t.homeStat4Label, val: t.homeStat4Val, bg: "bg-gradient-to-tr from-slate-900 to-slate-800 text-white shadow-md", txtColor: "text-white", icon: "Clock", iconBg: "bg-white/10 text-white" }
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`${stat.bg} p-5 md:p-6 rounded-2xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-3`}
              >
                <div className={`space-y-1 ${alignClass}`}>
                  <p className="text-[10px] md:text-xs opacity-75 font-semibold text-slate-500 text-inherit">{stat.label}</p>
                  <h3 className="text-lg md:text-2xl font-black tracking-tight">{stat.val}</h3>
                </div>
                <div className={`p-3 rounded-xl shrink-0 ${stat.iconBg}`}>
                  <DynamicIcon name={stat.icon as IconName} size={20} />
                </div>
              </div>
            ))}
          </section>

          {/* Location & Headquarters Section */}
          <section className="grid md:grid-cols-12 gap-8 items-center bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-md">
            <div className={`md:col-span-7 space-y-6 ${alignClass}`}>
              <span className="text-burgundy-700 font-bold text-xs tracking-wider flex items-center gap-1.5 justify-start">
                <span className="w-2 h-2 rounded-full bg-burgundy-600 animate-ping"></span>
                {t.locSectionTitle}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                {t.locMainHeader}
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {t.locDescription}
              </p>
              
              <div className="space-y-4 border-slate-100 border-s-2 ps-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-burgundy-100 text-burgundy-800 p-2 rounded-xl border border-burgundy-200 shrink-0">
                    <DynamicIcon name="MapPin" size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-950 text-xs md:text-sm">{t.locBullet1Title}</h4>
                    <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">{t.locBullet1Body}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-burgundy-100 text-burgundy-800 p-2 rounded-xl border border-burgundy-200 shrink-0">
                    <DynamicIcon name="Clock" size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-950 text-xs md:text-sm">{t.locBullet2Title}</h4>
                    <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">{t.locBullet2Body}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-burgundy-100 text-burgundy-800 p-2 rounded-xl border border-burgundy-200 shrink-0">
                    <DynamicIcon name="Phone" size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-950 text-xs md:text-sm">{t.locBullet3Title}</h4>
                    <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed" dir="ltr">{t.locBullet3Body}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5">
              {/* Refined Interactive Location Map */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 md:p-6 shadow-inner relative overflow-hidden space-y-4 text-center">
                <div className="absolute top-3 start-3 px-2.5 py-1 bg-burgundy-850 text-white text-[10px] font-bold rounded-lg shadow-sm">
                  {t.mapBlueprint}
                </div>
                
                {/* Visual Map Grid */}
                <div className="w-full h-48 bg-white rounded-xl border border-slate-200/60 relative flex items-center justify-center overflow-hidden shadow-sm">
                  {/* Decorative map lines */}
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-100"></div>
                  <div className="absolute top-0 left-1/3 w-[1px] h-full bg-slate-100"></div>
                  <div className="absolute top-0 left-2/3 w-[1px] h-full bg-slate-100"></div>
                  {/* Blue river القاش */}
                  <div className="absolute bottom-6 left-0 w-full h-9 bg-blue-50 border-y border-blue-100 flex items-center justify-center text-[9px] text-blue-500 font-bold select-none tracking-widest uppercase">
                    {t.mapRiverGash}
                  </div>
                  {/* Mount Taka representation */}
                  <div className="absolute -top-4 -left-4 w-20 h-20 bg-amber-500/[0.04] rounded-full border border-amber-500/10 flex items-end justify-center pb-1 text-[9px] text-amber-700/70 font-semibold uppercase">
                    {t.mapTakaMountains}
                  </div>
                  
                  {/* Location Pin */}
                  <div className="relative z-10 flex flex-col items-center animate-bounce">
                    <div className="p-2.5 bg-burgundy-900 text-white rounded-full shadow-lg border-2 border-white">
                      <DynamicIcon name="Building" size={16} />
                    </div>
                    <span className="mt-1 px-2.5 py-0.5 bg-burgundy-950 text-white text-[9px] font-bold rounded-full shadow-sm">
                      {t.mapHospitalPin}
                    </span>
                  </div>

                  {/* Neighborhood Marker */}
                  <div className="absolute top-6 start-6 text-[10px] text-slate-400 font-semibold">
                    {t.mapNeighborhood}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">{t.mapFooterTitle}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{t.mapFooterDesc}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Health Awareness Section */}
          <section id="health-awareness" className="bg-slate-50/50 border border-slate-200/60 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-burgundy-800 font-extrabold text-xs uppercase tracking-widest bg-burgundy-100 px-3.5 py-1 rounded-full">
                {t.healthAwarenessTitle}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {t.healthAwarenessSubtitle}
              </h2>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
                {t.healthAwarenessDesc}
              </p>
            </div>

            {/* Curated Health Tips Slider/Tab Layout */}
            <div className={`grid lg:grid-cols-12 gap-8 items-start`}>
              
              {/* Tabs sidebar */}
              <div className="lg:col-span-4 space-y-3">
                {curatedTips.map((tip, idx) => (
                  <button
                    key={tip.id}
                    onClick={() => setActiveCuratedIndex(idx)}
                    className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      activeCuratedIndex === idx
                        ? "bg-burgundy-900 border-burgundy-800 text-white shadow-md shadow-burgundy-900/10"
                        : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 shrink-0">
                      <div className={`p-2 rounded-xl shrink-0 ${activeCuratedIndex === idx ? "bg-white/10 text-white" : "bg-burgundy-100 text-burgundy-800"}`}>
                        <DynamicIcon name={tip.icon as IconName} size={18} />
                      </div>
                      <div className={alignClass}>
                        <p className="text-xs md:text-sm font-bold">{tip.title}</p>
                        <p className={`text-[10px] font-semibold opacity-75 ${activeCuratedIndex === idx ? "text-slate-300" : "text-slate-400"}`}>
                          {tip.category}
                        </p>
                      </div>
                    </div>
                    <DynamicIcon name={lang === "ar" ? "ChevronLeft" : "ChevronRight"} size={16} className="opacity-60 shrink-0" />
                  </button>
                ))}
              </div>

              {/* Active Tab Display details */}
              <div className="lg:col-span-8 bg-white border border-slate-200/80 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 relative overflow-hidden min-h-[360px] flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-32 h-32 bg-burgundy-100/20 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="space-y-4">
                  {/* Category and Icon */}
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-burgundy-100 text-burgundy-800 text-[10px] font-extrabold rounded-full border border-burgundy-200">
                      {curatedTips[activeCuratedIndex].category}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-400 text-xs font-semibold">
                      {lang === "ar" ? "إرشاد صحي موثق" : "Verified Health Guide"}
                    </span>
                  </div>

                  {/* Title and description */}
                  <div className={`space-y-2 ${alignClass}`}>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {curatedTips[activeCuratedIndex].title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-light">
                      {curatedTips[activeCuratedIndex].desc}
                    </p>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <h4 className={`text-xs font-bold text-slate-800 ${alignClass}`}>
                      {t.healthTipContentLabel}
                    </h4>
                    <ul className="space-y-2">
                      {curatedTips[activeCuratedIndex].bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 bg-burgundy-600 rounded-full shrink-0"></span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Kassala specific community note */}
                <div className="mt-6 p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex gap-3">
                  <div className="p-2 bg-amber-100 text-amber-850 rounded-xl shrink-0 h-fit">
                    <DynamicIcon name="AlertCircle" size={16} />
                  </div>
                  <div className={`space-y-1 ${alignClass}`}>
                    <p className="text-[10px] font-black text-amber-800 tracking-wider">
                      {lang === "ar" ? "هام لمجتمع ولاية كسلا وحي الجسر" : "KASSALA COMMUNITY NOTICE"}
                    </p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      {curatedTips[activeCuratedIndex].kassalaAdvice}
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Interactive AI Health Helper Search */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-burgundy-850/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className={`space-y-2 relative z-10 ${alignClass}`}>
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-burgundy-600/10 text-burgundy-500 rounded-lg">
                    <DynamicIcon name="Sparkles" size={14} />
                  </span>
                  <span className="text-[10px] font-bold text-burgundy-500 uppercase tracking-widest">
                    {lang === "ar" ? "المساعد الطبي الرقمي التفاعلي" : "INTERACTIVE AI CLINICAL ADVISOR"}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-white">
                  {lang === "ar" ? "توليد إرشاد صحي مخصص عبر الذكاء الاصطناعي" : "Generate Custom AI Medical Guidance"}
                </h3>
                <p className="text-xs md:text-sm text-stone-300 leading-relaxed font-light">
                  {lang === "ar" 
                    ? "هل تبحث عن إرشادات خاصة لحالة معينة أو نصيحة وقائية؟ اكتب سؤالك أو موضوعك هنا، وسيقوم المساعد الفوري بصياغة كشف توعوي طبي مخصص لظروف ولاية كسلا وموسمها الحالي."
                    : "Looking for advice on a specific condition or precaution? Ask below and our consultant will structure premium guidance optimized for Kassala's regional climate and seasons."}
                </p>
              </div>

              {/* Input container */}
              <div className="space-y-4 relative z-10">
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    value={healthTopic}
                    onChange={(e) => setHealthTopic(e.target.value)}
                    placeholder={t.healthTipTopicPlaceholder}
                    className={`flex-1 px-4 py-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs md:text-sm focus:outline-none focus:border-burgundy-600 focus:bg-slate-900 text-white font-semibold placeholder-slate-500 ${alignClass}`}
                  />
                  <button
                    onClick={() => handleFetchAiTip()}
                    disabled={isGeneratingTip || !healthTopic.trim()}
                    className="px-6 py-3 bg-white hover:bg-burgundy-100 text-burgundy-850 font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm shrink-0"
                  >
                    {isGeneratingTip ? (
                      <>
                        <div className="w-4 h-4 border-2 border-burgundy-950 border-t-transparent rounded-full animate-spin"></div>
                        <span>{t.healthTipGenerating}</span>
                      </>
                    ) : (
                      <>
                        <DynamicIcon name="Sparkles" size={14} />
                        <span>{t.healthTipBtnGenerate}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Popular Tags */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                    {lang === "ar" ? "مواضيع مقترحة:" : "Suggested Topics:"}
                  </span>
                  {(lang === "ar" 
                    ? ["الملاريا في موسم الخريف", "تغذية الأطفال الرضع", "تجنب ضربات الشمس", "الوقاية من الكوليرا بمياه نظيفة"]
                    : ["Malaria in Autumn", "Infant Nutrition & Millets", "Preventing Heat Stroke", "Cholera Prevention & Water Hygiene"]
                  ).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setHealthTopic(tag);
                        handleFetchAiTip(tag);
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] md:text-xs border border-slate-700/40 cursor-pointer transition-all hover:text-white"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Output Result Area */}
              {(isGeneratingTip || generatedTip) && (
                <div className="border border-slate-800/80 bg-slate-900/50 p-6 rounded-2xl space-y-6 relative overflow-hidden transition-all animate-fade-in z-10">
                  {isGeneratingTip ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                      <div className="relative">
                        <div className="w-12 h-12 border-4 border-burgundy-600/10 border-t-burgundy-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-burgundy-600">
                           <DynamicIcon name="Sparkles" size={16} className="animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs md:text-sm font-bold text-white">{t.healthTipGenerating}</p>
                        <p className="text-[10px] text-slate-500">{lang === "ar" ? "يرجى الانتظار لحين معالجة الإرشادات الوقائية..." : "Clinical model is analyzing prevention protocol..."}</p>
                      </div>
                    </div>
                  ) : (
                    generatedTip && (
                      <div className="space-y-5">
                        {/* Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-burgundy-600/10 text-burgundy-500 rounded-xl border border-burgundy-600/20 shadow-inner">
                              <DynamicIcon name="Heart" size={18} />
                            </div>
                            <div className={alignClass}>
                              <h4 className="text-base font-extrabold text-white">{generatedTip.title}</h4>
                              <p className="text-[10px] font-semibold text-burgundy-500">{generatedTip.category}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-burgundy-600/15 text-burgundy-500 text-[10px] font-extrabold rounded-full border border-burgundy-600/20">
                            {lang === "ar" ? "استشارة فورية" : "AI Consult"}
                          </span>
                        </div>

                        {/* Content */}
                        <div className={`space-y-3 ${alignClass}`}>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.healthTipContentLabel}</p>
                          <div className="text-xs md:text-sm text-slate-200 leading-relaxed font-light space-y-2 whitespace-pre-wrap">
                            {generatedTip.content}
                          </div>
                        </div>

                        {/* Kassala advice */}
                        {generatedTip.kassalaAdvice && (
                          <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-3">
                            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl shrink-0 h-fit">
                              <DynamicIcon name="AlertTriangle" size={16} />
                            </div>
                            <div className={`space-y-1 ${alignClass}`}>
                              <p className="text-[10px] font-black text-amber-400 tracking-wider">
                                {lang === "ar" ? "ملائمة خاصة ببيئة كسلا وحي الجسر" : "KASSALA ENVIRONMENTAL TAILORING"}
                              </p>
                              <p className="text-xs text-amber-300 leading-relaxed font-normal">
                                {generatedTip.kassalaAdvice}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Disclaimer */}
                        <p className="text-[9px] text-slate-500 leading-relaxed text-center font-medium max-w-2xl mx-auto pt-3 border-t border-slate-800">
                          {t.healthTipDisclaimer}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

          </section>

          {/* Department Message from Communication Officer */}
          <section className="bg-gradient-to-br from-burgundy-950 via-[#1A0505] to-burgundy-850 text-white rounded-3xl p-6 md:p-10 relative overflow-hidden flex flex-col md:flex-row gap-6 items-center shadow-lg border border-burgundy-950/20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent)] pointer-events-none"></div>
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 shadow-md">
              <DynamicIcon name="Megaphone" size={26} className="text-burgundy-300" />
            </div>
            <div className={`space-y-2 relative z-10 text-center ${alignClass}`}>
              <h3 className="text-base md:text-xl font-bold text-burgundy-300">
                {t.wordOfficerTitle}
              </h3>
              <p className="text-white/80 leading-relaxed text-xs md:text-sm font-light italic max-w-4xl">
                {t.wordOfficerBody}
              </p>
              <p className="text-[11px] font-bold text-burgundy-500 uppercase tracking-wide">
                {t.wordOfficerTeam}
              </p>
            </div>
          </section>
        </div>
      )}

      {/* 2. DEPARTMENTS VIEW */}
      {activeSubTab === "departments" && (
        <div className="space-y-8 animate-fade-in">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-burgundy-800 font-extrabold text-xs uppercase tracking-widest bg-burgundy-100 px-3.5 py-1 rounded-full">{t.deptSubTitle}</span>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">{t.deptTitle}</h2>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
              {t.deptDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-5">
                  {/* Icon Header */}
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-slate-50 group-hover:bg-burgundy-800 text-burgundy-900 group-hover:text-white rounded-xl border border-slate-150 transition-all shadow-sm">
                      <DynamicIcon name={dept.iconName as IconName} size={20} />
                    </div>
                    {dept.id === "dept-6" && (
                      <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-full border border-rose-100">
                        {t.deptHostBadge}
                      </span>
                    )}
                  </div>
                  
                  <div className={`space-y-2.5 ${alignClass}`}>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-burgundy-800 transition-colors">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {dept.description}
                    </p>
                  </div>

                  {/* Bullet features */}
                  <ul className="space-y-2.5 pt-3 border-t border-slate-100">
                    {dept.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-semibold justify-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-burgundy-600 shrink-0"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setActiveSubTab("contact")}
                    className="w-full py-2.5 bg-slate-50 hover:bg-burgundy-800 hover:text-white border border-slate-200 hover:border-burgundy-800 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <DynamicIcon name="MessageSquare" size={13} />
                    <span>{t.deptCTA}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. NEWS CENTER VIEW */}
      {activeSubTab === "news" && (
        <div className="space-y-8 animate-fade-in">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-burgundy-800 font-extrabold text-xs uppercase tracking-widest bg-burgundy-100 px-3.5 py-1 rounded-full">{t.mediaSubTitle}</span>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">{t.mediaTitle}</h2>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
              {t.mediaDesc}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={newsSearch}
                onChange={(e) => setNewsSearch(e.target.value)}
                className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs focus:outline-none focus:border-burgundy-800 focus:bg-white text-slate-900 font-semibold placeholder-slate-400 ${alignClass}`}
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 w-full md:w-auto justify-center md:justify-start">
              {[
                { label: t.filterAll, value: "all" },
                { label: t.filterPR, value: lang === "ar" ? "بيان صحفي" : "Press Release" },
                { label: t.filterCampaign, value: lang === "ar" ? "حملة توعوية" : "Awareness Campaign" },
                { label: t.filterHospNews, value: lang === "ar" ? "أخبار المستشفى" : "Hospital News" },
                { label: t.filterNotice, value: lang === "ar" ? "إعلان رسمي" : "Official Notice" }
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                    selectedCategory === cat.value
                      ? "bg-burgundy-800 text-white border-burgundy-900 shadow-sm shadow-burgundy-200"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {filteredNews.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredNews.map((article) => (
                <article
                  key={article.id}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Article Image or Placeholder */}
                  <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-burgundy-900 flex items-center justify-center text-white/10">
                        <DynamicIcon name="Megaphone" size={48} />
                      </div>
                    )}
                    
                    {/* Category Tag overlay */}
                    <div className="absolute top-3 start-3 px-2.5 py-1 bg-burgundy-950/80 text-white text-[9px] font-extrabold rounded-lg shadow-sm backdrop-blur-sm">
                      {lang === "ar" ? article.category : (
                        article.category === "بيان صحفي" ? "Press Release" :
                        article.category === "حملة توعوية" ? "Campaign" :
                        article.category === "أخبار المستشفى" ? "Hospital News" : "Official Notice"
                      )}
                    </div>

                    {article.isPublishedByStaff && (
                      <div className="absolute top-3 start-3 px-2 py-0.5 bg-green-600 text-white text-[9px] font-bold rounded-lg shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        <span>{t.articlePublishedTag}</span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className={`p-5 flex-1 flex flex-col justify-between space-y-4 ${alignClass}`}>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold justify-start">
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>{lang === "ar" ? "مستشفى المبارك" : "Al-Mubarak HQ"}</span>
                        <DynamicIcon name="Clock" size={12} />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 line-clamp-2 hover:text-burgundy-800 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-medium">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">ID: {article.id}</span>
                      <button
                        onClick={() => setSelectedNews(article)}
                        className="text-xs font-bold text-burgundy-900 hover:text-burgundy-700 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{t.readFullBtn}</span>
                        <DynamicIcon name="ArrowRight" size={13} className={lang === "ar" ? "rotate-180" : ""} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
              <div className="mx-auto w-12 h-12 bg-slate-50 text-burgundy-900 rounded-xl border border-slate-200/50 flex items-center justify-center">
                <DynamicIcon name="Megaphone" size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900">{t.articleEmptyTitle}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {t.articleEmptyDesc}
              </p>
            </div>
          )}

          {/* Detailed Article Modal */}
          {selectedNews && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] animate-scale-up">
                {/* Image Header inside Modal */}
                <div className="h-56 w-full bg-burgundy-950 relative shrink-0">
                  {selectedNews.image ? (
                    <img
                      src={selectedNews.image}
                      alt={selectedNews.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10">
                      <DynamicIcon name="Megaphone" size={64} />
                    </div>
                  )}
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedNews(null)}
                    className="absolute top-4 end-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all cursor-pointer"
                  >
                    <DynamicIcon name="X" size={16} />
                  </button>
                  {/* Floating Category tag */}
                  <div className="absolute bottom-4 start-6 px-3 py-1 bg-burgundy-850 text-white text-xs font-bold rounded-lg shadow-md">
                    {lang === "ar" ? selectedNews.category : (
                      selectedNews.category === "بيان صحفي" ? "Press Release" :
                      selectedNews.category === "حملة توعوية" ? "Campaign" :
                      selectedNews.category === "أخبار المستشفى" ? "Hospital News" : "Official Notice"
                    )}
                  </div>
                </div>

                {/* Content Box */}
                <div className={`p-6 md:p-8 flex-1 overflow-y-auto space-y-5 ${alignClass}`}>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-semibold justify-start">
                    <div className="flex items-center gap-1.5">
                      <DynamicIcon name="Clock" size={13} />
                      <span>{selectedNews.date}</span>
                    </div>
                    <span>•</span>
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-full border border-slate-200">
                      {lang === "ar" ? "مستشفى المبارك التخصصي - كسلا" : "Al-Mubarak Specialized Hospital Kassala"}
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
                    {selectedNews.title}
                  </h2>

                  <div className="border-t border-slate-100 pt-5">
                    <div className="text-slate-600 leading-relaxed text-sm md:text-base space-y-4 whitespace-pre-line font-sans font-medium">
                      {selectedNews.content}
                    </div>
                  </div>
                </div>

                {/* Footer inside Modal */}
                <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
                  <div className={`text-[11px] text-slate-400 font-semibold ${alignClass}`}>
                    {t.articleModalFooter}
                  </div>
                  <button
                    onClick={() => setSelectedNews(null)}
                    className="px-5 py-2 bg-burgundy-800 hover:bg-burgundy-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer border border-burgundy-900/10"
                  >
                    {t.closeModalBtn}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. CONTACT & PUBLIC FEEDBACK VIEW */}
      {activeSubTab === "contact" && (
        <div className="space-y-8 animate-fade-in">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-burgundy-800 font-extrabold text-xs uppercase tracking-widest bg-burgundy-100 px-3.5 py-1 rounded-full">{t.contactSubTitle}</span>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">{t.contactTitle}</h2>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
              {t.contactDesc}
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Column */}
            <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-md">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 pb-3.5 border-b border-slate-100">
                <DynamicIcon name="FileSignature" size={18} className="text-burgundy-800" />
                <span>{t.contactFormHeader}</span>
              </h3>

              <form onSubmit={handleSubmitFeedback} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className={`space-y-1.5 ${alignClass}`}>
                    <label className="text-xs font-bold text-slate-700">{t.formFullName}</label>
                    <input
                      type="text"
                      placeholder={t.formFullNamePlaceholder}
                      value={senderName}
                      onChange={(e) => { setSenderName(e.target.value); setFormErrors((prev) => { const next = { ...prev }; delete next.senderName; return next; }); }}
                      className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:bg-white font-semibold text-slate-900 ${alignClass} ${formErrors.senderName ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-burgundy-800"}`}
                    />
                    {formErrors.senderName && (
                      <p className="text-[11px] text-rose-600 font-medium">{formErrors.senderName}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className={`space-y-1.5 ${alignClass}`}>
                    <label className="text-xs font-bold text-slate-700">{t.formPhone}</label>
                    <input
                      type="tel"
                      placeholder={t.formPhonePlaceholder}
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setFormErrors((prev) => { const next = { ...prev }; delete next.phone; return next; }); }}
                      className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:bg-white font-semibold text-slate-900 ${alignClass} ${formErrors.phone ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-burgundy-800"}`}
                    />
                    {formErrors.phone && (
                      <p className="text-[11px] text-rose-600 font-medium">{formErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className={`space-y-1.5 ${alignClass}`}>
                    <label className="text-xs font-bold text-slate-700">{t.formEmail}</label>
                    <input
                      type="email"
                      placeholder={t.formEmailPlaceholder}
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setFormErrors((prev) => { const next = { ...prev }; delete next.email; return next; }); }}
                      className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:bg-white font-semibold text-slate-900 ${alignClass} ${formErrors.email ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-burgundy-800"}`}
                    />
                    {formErrors.email && (
                      <p className="text-[11px] text-rose-600 font-medium">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Message Type */}
                  <div className={`space-y-1.5 ${alignClass}`}>
                    <label className="text-xs font-bold text-slate-700">{t.formMsgType}</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as PatientFeedback["type"])}
                      className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-burgundy-800 focus:bg-white font-bold text-slate-900 ${alignClass}`}
                    >
                      <option value="inquiry">{lang === "ar" ? "استفسار عام" : "General Inquiry"}</option>
                      <option value="complaint">{lang === "ar" ? "شكوى أو ملاحظة" : "Complaint / Issue"}</option>
                      <option value="thank">{lang === "ar" ? "رسالة شكر وتقدير" : "Thanks & Appreciation"}</option>
                      <option value="suggestion">{lang === "ar" ? "اقتراح لتطوير الخدمات" : "Service Suggestion"}</option>
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div className={`space-y-1.5 ${alignClass}`}>
                  <label className="text-xs font-bold text-slate-700">{t.formSubject}</label>
                  <input
                    type="text"
                    placeholder={t.formSubjectPlaceholder}
                    value={subject}
                    onChange={(e) => { setSubject(e.target.value); setFormErrors((prev) => { const next = { ...prev }; delete next.subject; return next; }); }}
                    className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:bg-white font-semibold text-slate-900 ${alignClass} ${formErrors.subject ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-burgundy-800"}`}
                  />
                  {formErrors.subject && (
                    <p className="text-[11px] text-rose-600 font-medium">{formErrors.subject}</p>
                  )}
                </div>

                {/* Message */}
                <div className={`space-y-1.5 ${alignClass}`}>
                  <label className="text-xs font-bold text-slate-700">{t.formMessageContent}</label>
                  <textarea
                    rows={5}
                    placeholder={t.formMessagePlaceholder}
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); setFormErrors((prev) => { const next = { ...prev }; delete next.message; return next; }); }}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-xs focus:outline-none focus:bg-white font-semibold text-slate-900 leading-relaxed resize-none ${alignClass} ${formErrors.message ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-burgundy-800"}`}
                  ></textarea>
                  {formErrors.message && (
                    <p className="text-[11px] text-rose-600 font-medium">{formErrors.message}</p>
                  )}
                </div>

                <div className="flex pt-2 justify-start">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-burgundy-900 to-burgundy-800 hover:from-burgundy-750 hover:to-sky-650 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer text-xs"
                  >
                    <DynamicIcon name="Send" size={14} />
                    <span>{t.formSubmitBtn}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-4 space-y-6">
              {/* Box 1: Hospital official location */}
              <div className={`bg-white border border-slate-100 p-6 rounded-2xl space-y-4 shadow-sm ${alignClass}`}>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <DynamicIcon name="Building" size={16} className="text-burgundy-800" />
                  <span>{t.hqContactTitle}</span>
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {t.hqContactDesc}
                </p>
                <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-3.5 font-semibold">
                  <div className="flex items-center gap-2">
                    <DynamicIcon name="MapPin" size={14} className="text-burgundy-800 shrink-0" />
                    <span>{t.hqCity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DynamicIcon name="Phone" size={14} className="text-burgundy-800 shrink-0" />
                    <span dir="ltr">{t.hqSpokePhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DynamicIcon name="Mail" size={14} className="text-burgundy-800 shrink-0" />
                    <span>{t.hqEmail}</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Staff Portal Alert */}
              <div className="bg-beige-50 border border-beige-200 p-6 rounded-2xl space-y-4 shadow-sm text-center">
                <div className="mx-auto w-10 h-10 bg-gradient-to-tr from-burgundy-900 to-burgundy-800 text-white rounded-xl flex items-center justify-center shadow-md">
                  <DynamicIcon name="LayoutDashboard" size={16} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-burgundy-950 text-xs md:text-sm">{t.staffPromptTitle}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    {t.staffPromptDesc}
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
      
    </div>
  );
}
