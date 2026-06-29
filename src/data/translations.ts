import { NewsArticle, Department, PatientFeedback, MediaStat } from "../types";
import arTranslations from "./ar.json";
import enTranslations from "./en.json";

export const translations = {
  ar: arTranslations,
  en: enTranslations,
};

export function bilingualNews(lang: "ar" | "en", customNews?: NewsArticle[]): NewsArticle[] {
  const newsList = customNews || [];
  
  return newsList.map((item) => {
    // If it's a staff-published custom item, we can keep it as is, or attempt to translate/pass it
    if (item.id.startsWith("news-")) {
      if (item.id === "news-1") {
        return {
          ...item,
          title: lang === "ar" 
            ? "مستشفى المبارك يطلق حملة التوعية الكبرى للوقاية من حمى الضنك والأوبئة الموسمية في كسلا"
            : "Al-Mubarak Hospital Launches Major Dengue & Seasonal Epidemic Prevention Awareness Campaign in Kassala",
          excerpt: lang === "ar"
            ? "أطلق قسم الإعلام والتواصل بمستشفى المبارك بالتنسيق مع وزارة الصحة ولاية كسلا حملة توعوية كبرى تجوب أحياء المدينة للوقاية من الملاريا والضنك."
            : "The PR Department at Al-Mubarak Hospital, in collaboration with the Kassala State Ministry of Health, launched an awareness campaign to prevent malaria and dengue fever.",
          category: "حملة توعوية",
          content: lang === "ar"
            ? item.content
            : `Under the generous sponsorship of the General Director of Al-Mubarak Hospital in Kassala, and in close cooperation with the State Ministry of Health, the hospital's Media & Communication Department launched a major awareness and prevention campaign today under the theme **"Aware Kassala, Free from Epidemics"**.

The campaign, which involves clinical media and health personnel, aims to spread healthcare awareness on methods to prevent Dengue, Malaria, and other seasonal outbreaks linked to the autumn season and the Al-Gash river.

**Campaign features:**
* Distributing educational brochures and materials in markets, schools, and mosques within Al-Gisr and neighboring districts.
* Direct medical advice and clinical tips given directly to citizens.
* Coordination of spraying and epidemic containment programs with relevant bodies.

"The role of our hospital transcends clinical healing inside walls; it stands as a preventative safety valve that empowers the community against epidemic spreads," stated the Head of PR at Al-Mubarak Hospital.`
        };
      }
      if (item.id === "news-2") {
        return {
          ...item,
          title: lang === "ar"
            ? "تدشين وحدة العناية المكثفة الجديدة بمستشفى المبارك بحي الجسر لخدمة مواطني الولاية"
            : "Inauguration of the New ICU Unit at Al-Mubarak Hospital, Al-Gisr District",
          excerpt: lang === "ar"
            ? "في خطوة رائدة لتوطين العلاج بالولاية، احتفلت إدارة مستشفى المبارك بكسلا اليوم بتدشين وحدة العناية المكثفة بأحدث الأجهزة الطبية."
            : "In a pioneering step to localize specialized treatments, Al-Mubarak Hospital's management celebrated the opening of its state-of-the-art Intensive Care Unit.",
          category: "أخبار المستشفى",
          content: lang === "ar"
            ? item.content
            : `As part of its strategic plan to expand medical services and alleviate the burden of travel for critical care patients in eastern Sudan, Al-Mubarak Hospital in Al-Gisr, Kassala inaugurated its **newly developed, high-capacity Intensive Care Unit (ICU)**.

The opening ceremony was attended by health leaders, Kassala dignitaries, clinical staff, and media correspondents.

**Key features of the new unit:**
1. Advanced ventilators and cardiac monitoring systems from international medical tech brands.
2. Highly qualified critical care clinical nurses and specialists available 24/7.
3. Smart telemetry networks to track patient vital signs remotely from a central control desk.

The Medical Director emphasized that this unit represents a monumental leap for healthcare in Kassala and Al-Gisr, contributing directly to saving critical cases which previously required long, stressful transfers to the capital.`
        };
      }
      if (item.id === "news-3") {
        return {
          ...item,
          title: lang === "ar"
            ? "بيان صحفي: مستشفى المبارك يستقبل وفداً طبياً استشارياً لإجراء عمليات جراحية مجانية"
            : "Press Release: Al-Mubarak Hospital Hosts Medical Consultant Delegation for Free Surgeries",
          excerpt: lang === "ar"
            ? "يعلن مستشفى المبارك بكسلا عن استضافة وفد جراحي رفيع المستوى لإجراء عمليات جراحية نوعية ومعقدة للمواطنين مجاناً ابتداءً من مطلع الأسبوع المقبل."
            : "Al-Mubarak Hospital Kassala announces hosting a high-level surgical delegation to perform complex and specialized surgeries for citizens free of charge next week.",
          category: "بيان صحفي",
          content: lang === "ar"
            ? item.content
            : `**In the Name of God, the Merciful, the Compassionate**
**Press Statement Issued by Al-Mubarak Hospital - Public Relations Office**

Continuing its noble humanitarian and medical mission, Al-Mubarak Hospital in Al-Gisr, Kassala, announces to the public that it is hosting a **comprehensive charity surgical camp** featuring top consultants and surgeons from Sudan and abroad.

The medical team will perform free screenings and specialized surgeries in the following areas:
* General Surgery and Advanced Laparoscopic Procedures.
* Pediatric Surgery and congenital anomalies.
* Urology surgery.

**Registration and review details:**
* **Registration Venue:** Main Inquiry Desk, Al-Mubarak Hospital, Al-Gisr, Kassala.
* **Registration Period:** Starting tomorrow, Thursday, from 8:00 AM to 3:00 PM.
* **Camp Dates:** Starting next Saturday and continuing for a full week.

The Media Office urges all patients to bring past clinical reports, X-rays, and medical documents to facilitate easy screening. We wish all patients swift healing and wellness.

*Public Relations & Media Desk - Al-Mubarak Hospital*
*Al-Gisr, Kassala, Sudan*`
        };
      }
    }
    
    // Default fallback (custom written news)
    return item;
  });
}

export function bilingualDepartments(lang: "ar" | "en", customDepts: Department[]): Department[] {
  return customDepts.map((item) => {
    if (item.id === "dept-1") {
      return {
        ...item,
        name: lang === "ar" ? "قسم الباطنية والقلب" : "Internal Medicine & Cardiology",
        description: lang === "ar"
          ? "يقدم رعاية تخصصية شاملة للأمراض المزمنة وأمراض القلب والشرايين بأحدث أجهزة التخطيط والموجات الصوتية."
          : "Provides comprehensive specialized care for chronic illnesses, cardiovascular diseases using modern ECG and echo telemetry.",
        features: lang === "ar"
          ? ["تشخيص وعلاج ضغط الدم والسكري", "وحدة تخطيط ومراقبة القلب", "متابعة أمراض الجهاز الهضمي والغدد"]
          : ["Hypertension & diabetes therapeutic management", "ECG telemetry & cardiovascular monitoring unit", "Gastroenterology and endocrine health checkups"]
      };
    }
    if (item.id === "dept-2") {
      return {
        ...item,
        name: lang === "ar" ? "قسم طب الأطفال وحديثي الولادة" : "Pediatrics & Neonatal Care",
        description: lang === "ar"
          ? "عناية فائقة بأطفالنا من عمر الولادة وحتى اليافعين بوجود طاقم استشاري متميز ووحدة حضانات مجهزة بالكامل."
          : "Exemplary clinical care for infants and children, staffed by elite pediatric consultants and fully equipped incubators.",
        features: lang === "ar"
          ? ["متابعة نمو وتغذية الأطفال", "حضانات متطورة للأطفال المبتسرين", "علاج الحالات الموسمية والالتهابات المعوية"]
          : ["Child growth monitoring & nutrition plans", "Modern incubators for premature infants", "Management of seasonal pediatric ailments"]
      };
    }
    if (item.id === "dept-3") {
      return {
        ...item,
        name: lang === "ar" ? "قسم الجراحة العامة والمناظير" : "General Surgery & Laparoscopy",
        description: lang === "ar"
          ? "إجراء العمليات الجراحية الروتينية والمستعجلة وجراحات المناظير المتقدمة بأعلى معايير التعقيم العالمية."
          : "Routine and emergency general surgeries alongside modern laparoscopic procedures exceeding global sterilization protocols.",
        features: lang === "ar"
          ? ["عمليات المناظير والفتق والزائدة", "جراحات الغدة الدرقية والأورام", "طاقم تخدير متمكن وتقنيات تقليل الألم"]
          : ["Advanced laparoscopy, hernia, & appendectomies", "Thyroid and oncology surgeries", "Expert anesthesiology and advanced pain control"]
      };
    }
    if (item.id === "dept-4") {
      return {
        ...item,
        name: lang === "ar" ? "قسم النساء والتوليد" : "Obstetrics & Gynecology",
        description: lang === "ar"
          ? "متابعة آمنة للأمهات طوال فترة الحمل وحتى الولادة الطبيعية أو القيصرية مع غرف تنويم مريحة وخاصة."
          : "Secure maternity management throughout pregnancy, safe natural or C-section deliveries with comfortable private wards.",
        features: lang === "ar"
          ? ["متابعة الحمل الحرج بالموجات الصوتية رباعية الأبعاد", "عمليات الولادة القيصرية الآمنة", "رعاية الأم والطفل بعد الولادة مباشرة"]
          : ["High-risk pregnancy tracking via 4D Ultrasound", "Highly sterilized and safe C-section surgeries", "Postpartum care and neonate monitoring"]
      };
    }
    if (item.id === "dept-5") {
      return {
        ...item,
        name: lang === "ar" ? "قسم الطوارئ والإصابات" : "Emergency & Trauma Center",
        description: lang === "ar"
          ? "يعمل على مدار الساعة (24/7) لإنقاذ الأرواح والتعامل الفوري مع كافة الحوادث والحالات الحرجة بكسلا."
          : "Operating around the clock (24/7) to save lives, delivering immediate intervention for accidents and trauma in Kassala.",
        features: lang === "ar"
          ? ["سيارات إسعاف مجهزة بالكامل", "أطباء طوارئ ممارسين ذوي خبرة عالية", "فرز طبي ذكي لتقليل زمن الانتظار"]
          : ["Fully equipped mobile ICU ambulances", "Highly skilled emergency physicians", "Smart triage protocol to reduce waiting queues"]
      };
    }
    if (item.id === "dept-6") {
      return {
        ...item,
        name: lang === "ar" ? "قسم التواصل والإعلام الطبي" : "Medical PR & Communication Desk",
        description: lang === "ar"
          ? "النافذة الرسمية للمستشفى لنشر التوعية الصحية، وصياغة البيانات الصحفية، وتلقي استفسارات ومقترحات مواطني كسلا."
          : "The hospital's official conduit to broadcast health awareness, author press releases, and process citizen inquiries in Kassala.",
        features: lang === "ar"
          ? ["إصدار البيانات والأخبار الصحفية الرسمية", "إدارة حملات التوعية الصحية الميدانية والرقمية", "التواصل المستمر مع الجمهور والرد على المقترحات"]
          : ["Publishing official press statements and news", "Managing field-based and online awareness campaigns", "Direct citizen communication and responding to proposals"]
      };
    }
    return item;
  });
}

export function bilingualStats(lang: "ar" | "en", customStats: MediaStat[]): MediaStat[] {
  return customStats.map((item, idx) => {
    if (idx === 0) {
      return {
        ...item,
        label: lang === "ar" ? "التغطية الإعلامية للصحف والوكالات" : "Press & Agency Media Releases",
        value: lang === "ar" ? "14 بيان صحفي" : "14 Press Releases",
        change: lang === "ar" ? "+28% عن الشهر الماضي" : "+28% vs Last Month"
      };
    }
    if (idx === 1) {
      return {
        ...item,
        label: lang === "ar" ? "المنشورات وحملات التوعية الرقمية" : "Digital Campaigns & Public Outposts",
        value: lang === "ar" ? "35 حملة" : "35 Campaigns",
        change: lang === "ar" ? "+15% تفاعل نشط" : "+15% Active Engagement"
      };
    }
    if (idx === 2) {
      return {
        ...item,
        label: lang === "ar" ? "استفسارات المواطنين والردود عليها" : "Citizen Ticket Resolution Rate",
        value: lang === "ar" ? "94% نسبة إغلاق الردود" : "94% Resolution Rate",
        change: lang === "ar" ? "+5% سرعة استجابة" : "+5% Speed Increase"
      };
    }
    if (idx === 3) {
      return {
        ...item,
        label: lang === "ar" ? "زيارات الموقع الإلكتروني بكسلا" : "Kassala Citizens Web Traffic",
        value: lang === "ar" ? "4,820 زيارة" : "4,820 Visits",
        change: lang === "ar" ? "+40% زيادة زيارات" : "+40% Weekly Traffic Bump"
      };
    }
    return item;
  });
}

export function bilingualFeedbacks(lang: "ar" | "en", customFeedbacks: PatientFeedback[]): PatientFeedback[] {
  return customFeedbacks.map((item) => {
    if (item.id === "fb-1") {
      return {
        ...item,
        senderName: lang === "ar" ? "فاطمة أحمد طاهر" : "Fatima Ahmed Taher",
        subject: lang === "ar" ? "الاستفسار عن مواعيد عيادة الأطفال الاستشارية" : "Inquiry on Pediatric Consultant Clinic Hours",
        message: lang === "ar"
          ? "السلام عليكم ورحمة الله، أنا من سكان حي الجسر وأريد الاستفسار عن مواعيد عيادة الدكتور الاستشاري لطب الأطفال، وهل يحتاج التسجيل لحجز مسبق أم الحضور المباشر في الصباح؟ وجزاكم الله خيراً."
          : "Peace be upon you. I live in Al-Gisr district and would like to inquire about the working hours of the Pediatric Consultant Clinic. Does it require prior registration, or can I walk in directly in the morning? Thank you.",
        replyText: item.replyText // Only if replied
      };
    }
    if (item.id === "fb-2") {
      return {
        ...item,
        senderName: lang === "ar" ? "محمد عثمان جعفر" : "Mohammed Osman Gaafar",
        subject: lang === "ar" ? "شكوى بخصوص الازدحام في ممر الطوارئ" : "Complaint Regarding Emergency Ward Overcrowding",
        message: lang === "ar"
          ? "أود لفت نظر إدارة المستشفى الموقرة إلى وجود ازدحام شديد في ممرات الطوارئ ليلة الثلاثاء الماضي، وتأخر فرز الحالات لبعض الوقت. نرجو زيادة الكادر الطبي في أوقات الذروة لخدمة مرضى كسلا على أكمل وجه. مع خالص شكرنا لجهودكم الكبيرة."
          : "I would like to draw the administration's attention to significant overcrowding in emergency corridors last Tuesday night, causing triage delays. We request boosting clinical staff during peak hours to serve Kassala patients better. Thank you for your tireless efforts.",
        replyText: item.replyText
      };
    }
    if (item.id === "fb-3") {
      return {
        ...item,
        senderName: lang === "ar" ? "المهندس بكري صالح" : "Eng. Bakri Saleh",
        subject: lang === "ar" ? "رسالة شكر وتقدير لأطباء وممرضي قسم النساء والتوليد" : "Thank You Message to Obstetrics & Gynecology Team",
        message: lang === "ar"
          ? "أتقدم بخالص الشكر والتقدير لإدارة مستشفى المبارك وكوادره بقسم النساء والتوليد على العناية الفائقة والمعاملة الراقية والإنسانية التي تلقتها زوجتي أثناء عملية الولادة قبل يومين. بارك الله في جهودكم لخدمة إنسان ولاية كسلا."
          : "I express my sincere appreciation to Al-Mubarak Hospital's management and OB/GYN ward staff for the outstanding clinical care and gentle treatment my wife received during her delivery two days ago. May God bless your efforts.",
        replyText: lang === "ar"
          ? item.replyText
          : `**In the Name of God, the Merciful, the Compassionate**

Dear Eng. Bakri Saleh,

Peace and blessings be upon you,

We received your generous letter with immense pleasure and appreciation at Al-Mubarak Hospital's PR Department. We are deeply delighted to hear of the successful delivery and the sound health of your respected wife and newborn child.

Your supportive words serve as the greatest motivator for our clinical, nursing, and administrative personnel to continue rendering outstanding care with humane attention, fitting the proud citizens of Kassala and the historic Al-Gisr.

We have shared your kind feedback with the Head of OB/GYN and the medical team. We wish your family continuous wellness and happiness.

**With warm regards,**
*Public Relations & Media Desk*
*Al-Mubarak Hospital - Al-Gisr, Kassala*`
      };
    }
    return item;
  });
}
