import React, { useState } from "react";
import toast from "react-hot-toast";
import DynamicIcon, { IconName } from "./DynamicIcon";
import ScrollReveal from "./ScrollReveal";

interface TrainingSectionProps {
  lang: "ar" | "en";
}

export interface TrainingApplication {
  fullName: string;
  phone: string;
  email: string;
  education: string;
  specialty: string;
  experience: string;
  trainingType: string;
  message: string;
}

const trainingTypesAr = [
  "تدريب سريري (امتياز طب عام)",
  "تدريب تمريضي",
  "تدريب صيدلة",
  "تدريب مختبرات طبية",
  "تدريب أشعة",
  "تدريب إداري صحي",
  "تدريب تقنية معلومات صحية",
  "تدريب تطوعي مجتمعي",
];

const trainingTypesEn = [
  "Clinical Internship (General Medicine)",
  "Nursing Training",
  "Pharmacy Training",
  "Medical Laboratory Training",
  "Radiology Training",
  "Healthcare Administration",
  "Health IT Training",
  "Community Volunteer Training",
];

const educationLevelsAr = [
  "طالب (قيد الدراسة)",
  "خريج بكالوريوس",
  "دبلوم",
  "ماجستير",
  "دكتوراه",
];

const educationLevelsEn = [
  "Student (Currently Enrolled)",
  "Bachelor's Graduate",
  "Diploma",
  "Master's",
  "Doctorate (PhD)",
];

export default function TrainingSection({ lang }: TrainingSectionProps) {
  const isAr = lang === "ar";
  const trainingTypes = isAr ? trainingTypesAr : trainingTypesEn;
  const educationLevels = isAr ? educationLevelsAr : educationLevelsEn;

  const [form, setForm] = useState<TrainingApplication>({
    fullName: "",
    phone: "",
    email: "",
    education: "",
    specialty: "",
    experience: "",
    trainingType: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Hospital WhatsApp number
  const hospitalWhatsApp = "249100121111";

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = isAr ? "الاسم الكامل مطلوب" : "Full name is required";
    }
    if (!form.phone.trim()) {
      newErrors.phone = isAr ? "رقم الهاتف مطلوب" : "Phone number is required";
    } else if (!/^[\d\s+\-()]{7,20}$/.test(form.phone.trim())) {
      newErrors.phone = isAr ? "رقم هاتف غير صالح" : "Invalid phone number";
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = isAr ? "بريد إلكتروني غير صالح" : "Invalid email address";
    }
    if (!form.education) {
      newErrors.education = isAr ? "المستوى التعليمي مطلوب" : "Education level is required";
    }
    if (!form.specialty.trim()) {
      newErrors.specialty = isAr ? "التخصص مطلوب" : "Specialty is required";
    }
    if (!form.trainingType) {
      newErrors.trainingType = isAr ? "نوع التدريب مطلوب" : "Training type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof TrainingApplication, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const generateWhatsAppMessage = (): string => {
    const lines = [
      isAr ? "📋 *طلب تدريب جديد - مستشفى المبارك التخصصي*" : "📋 *New Training Application - Al-Mubarak Specialized Hospital*",
      "",
      isAr ? `👤 *الاسم:* ${form.fullName}` : `👤 *Name:* ${form.fullName}`,
      isAr ? `📞 *الهاتف:* ${form.phone}` : `📞 *Phone:* ${form.phone}`,
      form.email ? (isAr ? `📧 *البريد:* ${form.email}` : `📧 *Email:* ${form.email}`) : "",
      isAr ? `🎓 *المستوى التعليمي:* ${form.education}` : `🎓 *Education:* ${form.education}`,
      isAr ? `🔬 *التخصص:* ${form.specialty}` : `🔬 *Specialty:* ${form.specialty}`,
      isAr ? `💼 *الخبرة:* ${form.experience || "لا توجد"}` : `💼 *Experience:* ${form.experience || "None"}`,
      isAr ? `🏥 *نوع التدريب:* ${form.trainingType}` : `🏥 *Training Type:* ${form.trainingType}`,
      form.message ? (isAr ? `📝 *رسالة:* ${form.message}` : `📝 *Message:* ${form.message}`) : "",
      "",
      isAr ? "---" : "---",
      isAr ? "تم الإرسال من بوابة التدريب - مستشفى المبارك التخصصي" : "Sent via Training Portal - Al-Mubarak Specialized Hospital",
      isAr ? "مستشفى المبارك التخصصي" : "Al-Mubarak Specialized Hospital",
    ];
    return lines.filter((l) => l !== "").join("\n");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitted(true);

    // Open WhatsApp with the message
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${hospitalWhatsApp}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    toast.success(
      isAr
        ? "✅ تم فتح واتساب لإرسال الطلب! سيتم تحويلك تلقائياً."
        : "✅ WhatsApp opened to send your application! You'll be redirected automatically."
    );
  };

  const handleSendWhatsAppAgain = () => {
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${hospitalWhatsApp}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleReset = () => {
    setForm({
      fullName: "",
      phone: "",
      email: "",
      education: "",
      specialty: "",
      experience: "",
      trainingType: "",
      message: "",
    });
    setErrors({});
    setSubmitted(false);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-burgundy-500 focus:ring-4 focus:ring-burgundy-500/10 transition-all text-sm outline-none";
  const labelClass = "block text-xs font-bold text-slate-700 mb-1.5";
  const errorClass = "text-rose-500 text-[11px] font-semibold mt-1";

  const alignClass = isAr ? "text-right" : "text-left";

  return (
    <div className="w-full animate-fade-in">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064E3B] via-[#7F1D1D] to-slate-900 text-white p-8 md:p-14 shadow-xl border border-emerald-500/20 mb-10">
        <div className="absolute -top-20 -right-20 w-80 h-80 border-[30px] border-white/[0.03] rounded-full pointer-events-none"></div>
        <div className="absolute top-10 right-16 w-16 h-16 border border-white/10 rounded-3xl pointer-events-none rotate-12"></div>

        <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {isAr ? "بوابة التدريب والتطوير" : "Training & Development Portal"}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              {isAr ? "انطلق في مسيرة التميز الطبي" : "Begin Your Journey of Medical Excellence"}
            </h1>
            <p className="text-sm md:text-base text-slate-200/85 leading-relaxed">
              {isAr
                ? "يفتح مستشفى المبارك التخصصي أبوابه للكفاءات الطبية الشابة للتدريب العملي تحت إشراف نخبة من الاستشاريين. نساعدك على بناء مستقبلك المهني في بيئة طبية متكاملة."
                : "Al-Mubarak Specialized Hospital opens its doors to young medical talents for hands-on training under elite consultants. We help you build your professional future in a comprehensive medical environment."}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl text-xs font-semibold text-teal-200 border border-white/10">
                <DynamicIcon name="Award" size={14} />
                <span>{isAr ? "شهادة معتمدة" : "Certified Certificate"}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl text-xs font-semibold text-teal-200 border border-white/10">
                <DynamicIcon name="Users" size={14} />
                <span>{isAr ? "إشراف استشاريين" : "Consultant Supervision"}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-xl text-xs font-semibold text-teal-200 border border-white/10">
                <DynamicIcon name="Clock" size={14} />
                <span>{isAr ? "تدريب عملي" : "Practical Training"}</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[350px] aspect-square bg-gradient-to-tr from-teal-500/20 to-teal-400/5 rounded-3xl border border-white/10 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80')] bg-cover bg-center rounded-3xl opacity-40"></div>
              <div className="relative text-center p-6">
                <div className="p-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl mb-4">
                  <DynamicIcon name="GraduationCap" size={40} className="text-teal-300 mx-auto" />
                </div>
                <p className="text-white font-bold text-sm">
                  {isAr ? "نستثمر في كوادر المستقبل" : "Investing in Future Cadres"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="grid md:grid-cols-3 gap-5 mb-10">
        {[
          {
            icon: "Building" as IconName,
            title: isAr ? "بيئة طبية متكاملة" : "Integrated Medical Environment",
            desc: isAr
              ? "تدرب في مستشفى مجهز بأحدث الأجهزة والتقنيات الطبية تحت إشراف مباشر."
              : "Train in a hospital equipped with the latest medical devices and technologies under direct supervision.",
          },
          {
            icon: "Users" as IconName,
            title: isAr ? "كادر استشاري متميز" : "Distinguished Consultants",
            desc: isAr
              ? "احصل على توجيه من نخبة من الاستشاريين والأخصائيين ذوي الخبرة الواسعة."
              : "Receive guidance from elite consultants and specialists with extensive experience.",
          },
          {
            icon: "Award" as IconName,
            title: isAr ? "شهادة خبرة معتمدة" : "Accredited Experience Certificate",
            desc: isAr
              ? "احصل على شهادة تدريب معتمدة تعزز سيرتك الذاتية وتفتح لك آفاق التوظيف."
              : "Obtain an accredited training certificate that enhances your CV and opens employment opportunities.",
          },
        ].map((card, i) => (
          <ScrollReveal key={i} direction="fade-up" delay={i * 100}>
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full card-hover">
              <div className="p-3 bg-teal-50 text-teal-700 rounded-xl inline-block mb-4">
                <DynamicIcon name={card.icon} size={22} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-2">{card.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </section>

      {/* Application Form */}
      <ScrollReveal direction="fade-up" delay={200}>
        <section className="bg-white border border-slate-100 rounded-3xl shadow-lg p-6 md:p-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 space-y-2">
              <span className="text-teal-600 font-extrabold text-xs uppercase tracking-widest bg-teal-50 px-3.5 py-1 rounded-full inline-block">
                {isAr ? "نموذج التقديم" : "Application Form"}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                {isAr ? "قدم طلب التدريب الآن" : "Apply for Training Now"}
              </h2>
              <p className="text-slate-500 text-xs md:text-sm">
                {isAr
                  ? "املأ البيانات التالية وسيتم إرسال طلبك تلقائياً عبر الواتساب إلى قسم التدريب بالمستشفى."
                  : "Fill in the following details and your application will be sent automatically via WhatsApp to the hospital's training department."}
              </p>
            </div>

          {submitted ? (
            <div className="text-center space-y-6 py-8">
              <div className="p-6 bg-teal-50 border border-teal-100 rounded-2xl inline-block">
                <DynamicIcon name="CheckCircle" size={48} className="text-teal-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {isAr ? "تم تجهيز طلبك بنجاح! 🎉" : "Your Application is Ready! 🎉"}
              </h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                {isAr
                  ? "تم فتح تطبيق الواتساب لإرسال طلبك. إذا لم يتم الفتح تلقائياً، اضغط الزر أدناه."
                  : "WhatsApp has been opened to send your application. If it didn't open automatically, click the button below."}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={handleSendWhatsAppAgain}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-green-600/20 cursor-pointer"
                >
                  <DynamicIcon name="Send" size={16} />
                  <span>{isAr ? "إرسال عبر واتساب" : "Send via WhatsApp"}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  <DynamicIcon name="RotateCcw" size={16} />
                  <span>{isAr ? "تقديم طلب جديد" : "Submit New Application"}</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={`space-y-6 ${alignClass}`}>
              {/* Full Name */}
              <div>
                <label className={labelClass}>
                  {isAr ? "الاسم الكامل *" : "Full Name *"}
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder={isAr ? "مثال: أحمد عبد الله محمد" : "e.g., Ahmed Abdalla Mohamed"}
                  className={`${inputClass} ${errors.fullName ? "border-rose-400" : ""}`}
                />
                {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
              </div>

              {/* Phone & Email Row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    {isAr ? "رقم الهاتف (واتساب) *" : "Phone Number (WhatsApp) *"}
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder={isAr ? "مثال: 0912345678" : "e.g., +249 912 345 678"}
                    className={`${inputClass} ${errors.phone ? "border-rose-400" : ""}`}
                    dir="ltr"
                  />
                  {errors.phone && <p className={errorClass}>{errors.phone}</p>}
                </div>
                <div>
                  <label className={labelClass}>
                    {isAr ? "البريد الإلكتروني (اختياري)" : "Email (Optional)"}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder={isAr ? "مثال: example@email.com" : "e.g., example@email.com"}
                    className={`${inputClass} ${errors.email ? "border-rose-400" : ""}`}
                    dir="ltr"
                  />
                  {errors.email && <p className={errorClass}>{errors.email}</p>}
                </div>
              </div>

              {/* Education Level */}
              <div>
                <label className={labelClass}>
                  {isAr ? "المستوى التعليمي *" : "Education Level *"}
                </label>
                <select
                  value={form.education}
                  onChange={(e) => handleChange("education", e.target.value)}
                  className={`${inputClass} ${errors.education ? "border-rose-400" : ""}`}
                >
                  <option value="">
                    {isAr ? "-- اختر المستوى التعليمي --" : "-- Select Education Level --"}
                  </option>
                  {educationLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.education && <p className={errorClass}>{errors.education}</p>}
              </div>

              {/* Specialty */}
              <div>
                <label className={labelClass}>
                  {isAr ? "التخصص الدراسي *" : "Field of Study / Specialty *"}
                </label>
                <input
                  type="text"
                  value={form.specialty}
                  onChange={(e) => handleChange("specialty", e.target.value)}
                  placeholder={isAr ? "مثال: طب وجراحة عامة، تمريض، صيدلة..." : "e.g., General Medicine, Nursing, Pharmacy..."}
                  className={`${inputClass} ${errors.specialty ? "border-rose-400" : ""}`}
                />
                {errors.specialty && <p className={errorClass}>{errors.specialty}</p>}
              </div>

              {/* Training Type */}
              <div>
                <label className={labelClass}>
                  {isAr ? "نوع التدريب المطلوب *" : "Requested Training Type *"}
                </label>
                <select
                  value={form.trainingType}
                  onChange={(e) => handleChange("trainingType", e.target.value)}
                  className={`${inputClass} ${errors.trainingType ? "border-rose-400" : ""}`}
                >
                  <option value="">
                    {isAr ? "-- اختر نوع التدريب --" : "-- Select Training Type --"}
                  </option>
                  {trainingTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.trainingType && <p className={errorClass}>{errors.trainingType}</p>}
              </div>

              {/* Experience */}
              <div>
                <label className={labelClass}>
                  {isAr ? "الخبرات السابقة (إن وجدت)" : "Previous Experience (if any)"}
                </label>
                <textarea
                  value={form.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  placeholder={isAr ? "اذكر أي خبرات أو دورات سابقة..." : "Mention any previous experience or courses..."}
                  className={`${inputClass} min-h-[80px] resize-y`}
                  rows={3}
                ></textarea>
              </div>

              {/* Message */}
              <div>
                <label className={labelClass}>
                  {isAr ? "رسالة إضافية (اختياري)" : "Additional Message (Optional)"}
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder={isAr ? "أي ملاحظات أو استفسارات إضافية..." : "Any additional notes or inquiries..."}
                  className={`${inputClass} min-h-[80px] resize-y`}
                  rows={3}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-600/15 cursor-pointer text-sm"
              >
                <DynamicIcon name="Send" size={16} />
                <span>
                  {isAr ? "إرسال الطلب عبر واتساب" : "Send Application via WhatsApp"}
                </span>
              </button>

              <p className="text-[10px] text-slate-400 text-center">
                {isAr
                  ? "بالضغط على زر الإرسال، سيتم فتح تطبيق واتساب لإرسال بياناتك مباشرة إلى قسم التدريب بالمستشفى."
                  : "By clicking send, WhatsApp will open to send your data directly to the hospital's training department."}
              </p>
            </form>
          )}
        </div>
      </section>
      </ScrollReveal>

      {/* Why Train With Us */}
      <ScrollReveal direction="fade-up" delay={250}>
      <section className="mt-10 bg-slate-50/70 border border-slate-200/60 rounded-3xl p-6 md:p-10">
        <div className="text-center mb-8">
          <span className="text-teal-600 font-extrabold text-xs uppercase tracking-widest bg-teal-50 px-3.5 py-1 rounded-full inline-block">
            {isAr ? "لماذا التدريب عندنا؟" : "Why Train With Us?"}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-3">
            {isAr ? "مميزات التدريب في مستشفى المبارك" : "Training Benefits at Al-Mubarak Hospital"}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: "Stethoscope" as IconName,
              title: isAr ? "تدريب عملي" : "Hands-on Training",
              desc: isAr ? "تطبيق مباشر على المرضى تحت إشراف استشاريين." : "Direct patient practice under consultant supervision.",
            },
            {
              icon: "FileText" as IconName,
              title: isAr ? "شهادة موثقة" : "Certified Document",
              desc: isAr ? "شهادة رسمية من المستشفى معتمدة للتوظيف." : "Official hospital certificate for employment.",
            },
            {
              icon: "Clock" as IconName,
              title: isAr ? "جدول مرن" : "Flexible Schedule",
              desc: isAr ? "برامج تدريب صباحية ومسائية تناسب الجميع." : "Morning and evening programs suiting everyone.",
            },
            {
              icon: "MapPin" as IconName,
              title: isAr ? "موقع متميز" : "Prime Location",
              desc: isAr ? "موقع متميز بالقرب من جميع وسائل المواصلات." : "Convenient location near public transport.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 text-center hover:shadow-md transition-all duration-300">
              <div className="p-3 bg-teal-50 text-teal-600 rounded-xl inline-block mb-3">
                <DynamicIcon name={item.icon} size={20} />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1.5">{item.title}</h4>
              <p className="text-[11px] text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      </ScrollReveal>

      {/* Contact Info */}
      <section className="mt-8 text-center p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
        <p className="text-xs text-slate-500">
          {isAr
            ? "للاستفسار المباشر: واتساب 249100121111+ | مقر التدريب: مستشفى المبارك التخصصي"
            : "Direct Inquiries: WhatsApp +249100121111 | Training HQ: Al-Mubarak Specialized Hospital"}
        </p>
      </section>
    </div>
  );
}
