import { NewsArticle, Department, PatientFeedback, MediaStat, Doctor } from "../types";
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
            ? "تدشين وحدة العناية المكثفة الجديدة بمستشفى المبارك لخدمة المرضى والمواطنين"
            : "Inauguration of the New ICU Unit at Al-Mubarak Hospital",
          excerpt: lang === "ar"
            ? "في خطوة رائدة لتوطين العلاج، احتفلت إدارة مستشفى المبارك اليوم بتدشين وحدة العناية المكثفة بأحدث الأجهزة الطبية."
            : "In a pioneering step to localize specialized treatments, Al-Mubarak Hospital's management celebrated the opening of its state-of-the-art Intensive Care Unit.",
          category: "أخبار المستشفى",
          content: lang === "ar"
            ? item.content
            : `As part of its strategic plan to expand medical services and alleviate the burden of travel for critical care patients, Al-Mubarak Hospital inaugurated its **newly developed, high-capacity Intensive Care Unit (ICU)**.

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
        name: lang === "ar" ? "عيادة أمراض النساء والتوليد وجراحة المناظير" : "Obstetrics, Gynecology & Laparoscopy Clinic",
        description: lang === "ar"
          ? "رعاية تخصصية للأمهات والحمل الحرج وجراحات الأورام واستئصال الرحم ومناظير الأنابيب لعلاج العقم والخصوبة."
          : "Specialized maternal care, high-risk pregnancy, oncology surgery, hysterectomies, and tubal laparoscopy for fertility.",
        features: lang === "ar"
          ? ["متابعة الحمل بالموجات رباعية الأبعاد", "عمليات القيصرية وعلاج العقم والخصوبة", "جراحات المناظير النسائية المتقدمة"]
          : ["4D Ultrasound pregnancy monitoring", "C-section deliveries & fertility treatments", "Advanced laparoscopic gynecological surgery"]
      };
    }
    if (item.id === "dept-2") {
      return {
        ...item,
        name: lang === "ar" ? "عيادة طب وصحة الطفل والخدج" : "Pediatrics & Neonatal Care Clinic",
        description: lang === "ar"
          ? "عناية فائقة بأطفالنا من عمر الولادة وحتى اليافعين بوجود استشاريين متميزين ووحدة حضانات مجهزة بـ 5 حضانات للأطفال المبتسرين."
          : "Exemplary clinical care for infants and children, staffed by elite pediatric consultants and a 5-incubator NICU unit.",
        features: lang === "ar"
          ? ["متابعة النمو والتغذية للرضع والأطفال", "5 حضانات متطورة و10 أسرّة لحديثي الولادة", "علاج الأمراض الموسمية والالتهابات"]
          : ["Child growth monitoring & infant nutrition", "5 advanced incubators & 10 neonate beds", "Management of seasonal pediatric ailments"]
      };
    }
    if (item.id === "dept-3") {
      return {
        ...item,
        name: lang === "ar" ? "عيادة جراحة العظام والإصابات" : "Orthopedic Surgery & Trauma Clinic",
        description: lang === "ar"
          ? "تشخيص وجراحة العظام وتثبيت المساطر والمخروقة والكسور المعقدة بأحدث المعدات الجراحية."
          : "Diagnosis and surgical management of complex fractures, internal fixation, and orthopedic trauma.",
        features: lang === "ar"
          ? ["عمليات تثبيت المساطر والمخروقة", "علاج الإصابات وحوادث الطرق", "تقويم مفاصل وجراحات العظام"]
          : ["Plate & screw internal fixation surgeries", "Road accident & trauma management", "Joint alignment & orthopedic procedures"]
      };
    }
    if (item.id === "dept-4") {
      return {
        ...item,
        name: lang === "ar" ? "عيادة جراحة المخ والأعصاب (اختصاصي زائر)" : "Neurosurgery & Spine Clinic (Visiting Consultant)",
        description: lang === "ar"
          ? "جراحات المخ والعمود الفقري الدقيقة لتوطين الخدمة بكسلا وتوفير مشقة السفر للعاصمة."
          : "Precision brain and spine surgeries, localizing specialized neurosurgical care in Kassala without capital travel.",
        features: lang === "ar"
          ? ["جراحات دقيقة للمخ والعمود الفقري", "استقطاب كبار الاستشاريين الزائرين", "متابعة الحالات المعقدة"]
          : ["Precision brain & spine surgical procedures", "Hosting top visiting consultants", "Complex neurological case management"]
      };
    }
    if (item.id === "dept-5") {
      return {
        ...item,
        name: lang === "ar" ? "عيادة الجراحة العامة والجهاز الهضمي والمناظير" : "General, GI & Laparoscopic Surgery Clinic",
        description: lang === "ar"
          ? "جراحات القولون، الزائدة، الفتق، الغدة الدرقية، وأورام الجهاز الهضمي بمناظير متطورة."
          : "Colon, appendectomy, hernia, thyroid, and gastrointestinal oncology surgeries using advanced endoscopic equipment.",
        features: lang === "ar"
          ? ["جراحات المناظير والقولون", "استئصال الأورام والفتق والزائدة", "تخدير وتقنيات خفض الألم"]
          : ["Laparoscopic & colorectal surgeries", "Tumor resections, hernias, & appendectomies", "Modern anesthesia & pain minimization"]
      };
    }
    if (item.id === "dept-6") {
      return {
        ...item,
        name: lang === "ar" ? "عيادة جراحة المسالك البولية وزراعة الكلى" : "Urology & Kidney Transplant Clinic",
        description: lang === "ar"
          ? "خدمات تخصصية دقيقة في المسالك البولية ومناظير التفتيت وعيادة زراعة الكلى بكسلا."
          : "Specialized urological procedures, lithotripsy endoscopy, and kidney transplant follow-up clinics in Kassala.",
        features: lang === "ar"
          ? ["مناظير تفتيت الحصوات والمسالك", "متابعة وعيادات زراعة الكلى", "جراحات الكلى المتقدمة"]
          : ["Stone lithotripsy & urological endoscopy", "Kidney transplant follow-up care", "Advanced renal surgical care"]
      };
    }
    if (item.id === "dept-7") {
      return {
        ...item,
        name: lang === "ar" ? "عيادة الباطنية وأمراض الكلى" : "Internal Medicine & Nephrology Clinic",
        description: lang === "ar"
          ? "علاج الأمراض المزمنة، السكري، ضغط الدم، متابعة الفشل الكلوي والأمراض الباطنية المعقدة."
          : "Management of chronic diseases, diabetes, hypertension, renal impairment, and complex internal ailments.",
        features: lang === "ar"
          ? ["متابعة ضغط الدم والسكري والقلب", "تشخيص أمراض الكلى وغدد الأيض", "رعاية الأمراض المزمنة"]
          : ["Hypertension, diabetes, & cardiac tracking", "Renal & endocrine diagnostic care", "Chronic disease long-term management"]
      };
    }
    if (item.id === "dept-8") {
      return {
        ...item,
        name: lang === "ar" ? "عيادة المناعة السريرية والروماتيزم والحساسية" : "Clinical Immunology, Rheumatology & Allergy",
        description: lang === "ar"
          ? "تشخيص وعلاج أمراض الروماتيزم، التهابات المفاصل المناعية، والاضطرابات الحساسية السريرية."
          : "Diagnosis and care for rheumatic disorders, autoimmune arthritis, and clinical allergic conditions.",
        features: lang === "ar"
          ? ["علاج الروماتيزم والتهاب المفاصل", "فحوصات أمراض المناعة الذاتية", "متابعة حالات الحساسية المزمنة"]
          : ["Rheumatoid & arthritis therapy", "Autoimmune panel diagnostic testing", "Chronic allergy disease management"]
      };
    }
    if (item.id === "dept-9") {
      return {
        ...item,
        name: lang === "ar" ? "عيادة أمراض الدم والنخاع الشوكي" : "Hematology & Bone Marrow Clinic",
        description: lang === "ar"
          ? "تشخيص اضطرابات الدم، الأنيميا الحادة والمزمنة، ومتابعة أمراض نخاع العظم."
          : "Diagnosis of blood disorders, acute and chronic anemias, and bone marrow clinical evaluation.",
        features: lang === "ar"
          ? ["فحوصات واضطرابات أمراض الدم", "متابعة الأنيميا ونخاع العظم", "استشارات أمراض الدم التخصصية"]
          : ["Complete hematology disorder workup", "Anemia & marrow tracking", "Specialized hematologist consultation"]
      };
    }
    if (item.id === "dept-10") {
      return {
        ...item,
        name: lang === "ar" ? "عيادة الأمراض الجلدية والتناسلية والتجميل" : "Dermatology, Venereology & Aesthetic Clinic",
        description: lang === "ar"
          ? "علاج الأمراض الجلدية المزمنة والتناسلية واستشارات التجميل والعناية بالبشرة."
          : "Management of chronic skin diseases, venereal disorders, and aesthetic skincare consultations.",
        features: lang === "ar"
          ? ["علاج الصدفية والأكزيما والجلدية", "استشارات التجميل والعناية بالبشرة", "تشخيص الأمراض التناسلية"]
          : ["Psoriasis, eczema, & clinical dermatology", "Aesthetic skin consultations", "Venereal condition diagnostics"]
      };
    }
    if (item.id === "dept-11") {
      return {
        ...item,
        name: lang === "ar" ? "عيادة جراحة التجميل والترميم والحروق" : "Plastic, Reconstructive & Burn Surgery Clinic",
        description: lang === "ar"
          ? "جراحات الترميم بعد الإصابات والحروق، التجميل الجراحي، وتعديل التشوهات."
          : "Post-burn reconstructive surgeries, surgical aesthetics, and congenital defect corrections.",
        features: lang === "ar"
          ? ["جراحات الترميم بعد الحروق", "تعديل الندبات والتشوهات", "جراحات التجميل الدقيقة"]
          : ["Post-trauma & burn reconstruction", "Scar revision & defect correction", "Precision aesthetic surgical procedures"]
      };
    }
    if (item.id === "dept-12") {
      return {
        ...item,
        name: lang === "ar" ? "عيادة التخدير وعلاج الألم" : "Anesthesiology & Pain Management Clinic",
        description: lang === "ar"
          ? "تقييم التخدير قبل العمليات الجراحية وإدارة وتخفيف الآلام الحادة والمزمنة بأحدث الممارسات."
          : "Pre-operative anesthetic evaluations and acute/chronic pain management interventions.",
        features: lang === "ar"
          ? ["تخدير عام وإقليمي معقم", "إدارة وتخفيف آلام ما بعد العمليات", "عيادة تسكين الآلام المزمنة"]
          : ["Sterile general & regional anesthesia", "Post-operative analgesia protocols", "Chronic pain intervention desk"]
      };
    }
    if (item.id === "dept-13") {
      return {
        ...item,
        name: lang === "ar" ? "عيادة جراحة الأطفال والمسالك بولية أطفال" : "Pediatric Surgery & Pediatric Urology Clinic",
        description: lang === "ar"
          ? "جراحات التشوهات الخلقية للأطفال، فتق الأطفال، ومسالك الأطفال الجراحية."
          : "Correction of congenital anomalies in children, pediatric hernia repairs, and pediatric urological surgeries.",
        features: lang === "ar"
          ? ["جراحات التشوهات الخلقية", "مسالك بولية للأطفال", "جراحات الأطفال العامة"]
          : ["Congenital anomaly surgical repair", "Pediatric urology interventions", "General pediatric surgical care"]
      };
    }
    if (item.id === "dept-14") {
      return {
        ...item,
        name: lang === "ar" ? "عيادة جراحة الوجه والفكين" : "Maxillofacial Surgery Clinic",
        description: lang === "ar"
          ? "جراحات إصابات كسور الوجه والفكين، الأورام، والعمليات التنويرية للفكين."
          : "Facial trauma and fracture fixations, jaw tumor resections, and reconstructive oral surgery.",
        features: lang === "ar"
          ? ["جراحة كسور الوجه والفكين", "أورام وأكياس الفكين", "ترميم الوجه والجراحة الفكية"]
          : ["Facial trauma & jaw fracture fixation", "Jaw cyst & tumor surgical resections", "Maxillofacial reconstructive procedures"]
      };
    }
    if (item.id === "dept-15") {
      return {
        ...item,
        name: lang === "ar" ? "قسم الأشعة والتصوير الطبي (CT Scan)" : "Radiology & CT Scan Department",
        description: lang === "ar"
          ? "أحدث جهاز أشعة مقطعية بكسلا يعمل 24 ساعة للكشف عن الأورام والحالات الحرجة والأشعة الرقمية."
          : "Kassala's newest 24/7 multi-slice CT scan unit for early tumor detection, trauma, and digital X-ray diagnostics.",
        features: lang === "ar"
          ? ["أشعة مقطعية (CT Scan) على مدار 24 ساعة", "أشعة سينية رقمية عالية الدقة", "تشخيص مبكر للأورام والإصابات"]
          : ["24/7 Multi-slice CT scan unit", "High-definition digital X-ray imaging", "Early oncological & emergency diagnostics"]
      };
    }
    if (item.id === "dept-16") {
      return {
        ...item,
        name: lang === "ar" ? "قسم المعمل ومعمل الأنسجة والسرطانات" : "Laboratory & Histopathology Department",
        description: lang === "ar"
          ? "أول معمل للأنسجة المريضة والخلايا السرطانية في ولاية كسلا بنسبة تشغيل 100% وفحوصات هرمونية متطورة."
          : "Kassala State's 1st histopathology & cancer cytology lab operating at 100% capacity alongside hormonal diagnostic panels.",
        features: lang === "ar"
          ? ["أول معمل أنسجة سرطانية بولاية كسلا", "فحوصات هرمونية وكيمياء حيوية", "نتائج دقيقة وسريعة"]
          : ["Kassala's 1st cancer histopathology lab", "Comprehensive endocrine & biochemistry panels", "High-accuracy rapid turnaround results"]
      };
    }
    if (item.id === "dept-17") {
      return {
        ...item,
        name: lang === "ar" ? "قسم الطوارئ والإصابات (24/7)" : "24/7 Emergency & Trauma Center",
        description: lang === "ar"
          ? "استقبال جميع الحالات الحرجة والحوادث بفرز طبي سريع وسعة 3 عنابر تنويم 24/7."
          : "24/7 immediate trauma intervention with rapid clinical triage and 3 inpatient emergency wards.",
        features: lang === "ar"
          ? ["استقبال وتدخّل فوري 24/7", "3 عنابر تنويم وسيارة إسعاف", "فرز طبي وإنقاذ حياة"]
          : ["24/7 Immediate resuscitation & trauma intake", "3 emergency observation wards & ambulance", "Rapid clinical triage protocols"]
      };
    }
    if (item.id === "dept-18") {
      return {
        ...item,
        name: lang === "ar" ? "صيدلية المستشفى الرئيسية" : "Main Hospital Pharmacy",
        description: lang === "ar"
          ? "صيدلية متكاملة توفر كافة العلاجات والمستلزمات الطبية على مدار الساعة."
          : "Fully integrated hospital pharmacy dispensing medications and medical supplies 24/7.",
        features: lang === "ar"
          ? ["توفير شامل للأدوية والمستلزمات", "خدمة سريعة وصرف متواصل 24/7", "استشارات دوائية معتمدة"]
          : ["Comprehensive drug & supply availability", "24/7 continuous dispensing desk", "Licensed clinical pharmacist guidance"]
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
          ? "السلام عليكم ورحمة الله، أريد الاستفسار عن مواعيد عيادة الدكتور الاستشاري لطب الأطفال، وهل يحتاج التسجيل لحجز مسبق أم الحضور المباشر في الصباح؟ وجزاكم الله خيراً."
          : "Peace be upon you. I would like to inquire about the working hours of the Pediatric Consultant Clinic. Does it require prior registration, or can I walk in directly in the morning? Thank you.",
        replyText: item.replyText // Only if replied
      };
    }
    if (item.id === "fb-2") {
      return {
        ...item,
        senderName: lang === "ar" ? "محمد عثمان جعفر" : "Mohammed Osman Gaafar",
        subject: lang === "ar" ? "شكوى بخصوص الازدحام في ممر الطوارئ" : "Complaint Regarding Emergency Ward Overcrowding",
        message: lang === "ar"
          ? "أود لفت نظر إدارة المستشفى الموقرة إلى وجود ازدحام شديد في ممرات الطوارئ ليلة الثلاثاء الماضي، وتأخر فرز الحالات لبعض الوقت. نرجو زيادة الكادر الطبي في أوقات الذروة لخدمة المرضى على أكمل وجه. مع خالص شكرنا لجهودكم الكبيرة."
          : "I would like to draw the administration's attention to significant overcrowding in emergency corridors last Tuesday night, causing triage delays. We request boosting clinical staff during peak hours to serve patients better. Thank you for your tireless efforts.",
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

export function bilingualDoctors(lang: "ar" | "en", customDoctors: Doctor[]): Doctor[] {
  return customDoctors.map((doc) => {
    if (doc.id === "doc-1") {
      return {
        ...doc,
        name: lang === "ar" ? "د. عبدالرحمن المبارك" : "Dr. Abdulrahman Al-Mubarak",
        title: lang === "ar"
          ? "استشاري أول النساء والتوليد والعقم وجراحة المناظير"
          : "Senior Consultant OB/GYN, Infertility & Laparoscopic Surgery",
        specialty: lang === "ar" ? "النساء والتوليد والعقم" : "OB/GYN & Infertility",
        availableDays: lang === "ar"
          ? ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"]
          : ["Sun", "Mon", "Tue", "Wed", "Thu"]
      };
    }
    if (doc.id === "doc-2") {
      return {
        ...doc,
        name: lang === "ar" ? "د. أحمد حسن العبيد" : "Dr. Ahmed Hassan Al-Obeid",
        title: lang === "ar"
          ? "استشاري جراحة المخ والأعصاب والعمود الفقري"
          : "Neurosurgery & Spine Surgery Consultant",
        specialty: lang === "ar" ? "جراحة المخ والأعصاب" : "Neurosurgery & Spine",
        availableDays: lang === "ar"
          ? ["السبت", "الأحد", "الإثنين"]
          : ["Sat", "Sun", "Mon"]
      };
    }
    if (doc.id === "doc-3") {
      return {
        ...doc,
        name: lang === "ar" ? "د. طارق مصطفى سليمان" : "Dr. Tariq Mustafa Suleiman",
        title: lang === "ar"
          ? "استشاري جراحة المسالك البولية وزراعة الكلى والمناظير"
          : "Urology, Kidney Transplant & Endoscopy Consultant",
        specialty: lang === "ar" ? "المسالك البولية وزراعة الكلى" : "Urology & Kidney Transplant",
        availableDays: lang === "ar"
          ? ["الثلاثاء", "الأربعاء", "الخميس"]
          : ["Tue", "Wed", "Thu"]
      };
    }
    if (doc.id === "doc-4") {
      return {
        ...doc,
        name: lang === "ar" ? "د. مريم عثمان علي" : "Dr. Maryam Osman Ali",
        title: lang === "ar"
          ? "استشاري طب وصحة الطفل والمبتسرين"
          : "Pediatrics & Neonatal Care Consultant",
        specialty: lang === "ar" ? "طب الأطفال والحضانة" : "Pediatrics & NICU",
        availableDays: lang === "ar"
          ? ["يومياً 24 ساعة"]
          : ["Daily 24/7"]
      };
    }
    return doc;
  });
}
