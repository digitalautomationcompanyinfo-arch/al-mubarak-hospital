import React, { useState, useEffect } from "react";
import ScrollReveal from "./ScrollReveal";
import DynamicIcon, { IconName } from "./DynamicIcon";
import { translations } from "../data/translations";

interface PhotoGalleryProps {
  lang: "ar" | "en";
}

interface GalleryItem {
  id: string;
  src: string;
  category: string;
  captionAr: string;
  captionEn: string;
}

const galleryCategories = [
  { id: "all", labelAr: "الكل", labelEn: "All", icon: "Grid3X3" },
  { id: "operations", labelAr: "قسم العمليات", labelEn: "Operations", icon: "Activity" },
  { id: "nursery", labelAr: "الحضانة والخدج", labelEn: "Nursery & NICU", icon: "Baby" },
  { id: "rooms", labelAr: "الغرف والأجنحة", labelEn: "Rooms & Wards", icon: "Bed" },
  { id: "pharmacy", labelAr: "الصيدلية", labelEn: "Pharmacy", icon: "Pill" },
  { id: "reception", labelAr: "الاستقبال", labelEn: "Reception", icon: "Users" },
  { id: "nursing", labelAr: "محطة التمريض", labelEn: "Nursing", icon: "HeartPulse" },
];

const galleryImages: GalleryItem[] = [
  // Operations (11 images)
  { id: "img-1", src: "/pptx_images/slide12_img22.jpg", category: "operations", captionAr: "فريق جراحي متكامل أثناء إجراء عملية معقدة", captionEn: "Full surgical team during complex operation" },
  { id: "img-2", src: "/pptx_images/slide12_img23.jpg", category: "operations", captionAr: "طبيب التخدير مع جهاز التخدير بغرفة العمليات", captionEn: "Anesthesiologist with anesthesia system in OR" },
  { id: "img-3", src: "/pptx_images/slide13_img33.jpg", category: "operations", captionAr: "إجراء عملية جراحية بالضوء المعقم", captionEn: "Surgical operation under sterile lighting" },
  { id: "img-4", src: "/pptx_images/slide13_img36.jpg", category: "operations", captionAr: "كادر الجراحة باللباس المعقم الكامل", captionEn: "Surgical staff in complete sterile attire" },
  { id: "img-5", src: "/pptx_images/slide13_img31.jpg", category: "operations", captionAr: "غرفة العمليات الرئيسية ومعدات التخدير", captionEn: "Main operating theater & anesthesia setup" },
  { id: "img-6", src: "/pptx_images/slide13_img35.jpg", category: "operations", captionAr: "تجهيز وتفقد أدوات التخدير والعلامات الحيوية", captionEn: "Checking anesthesia gear and vital signs" },
  { id: "img-7", src: "/pptx_images/slide13_img25.jpg", category: "operations", captionAr: "تحضير الدواء والحقن الجراحية المعقمة", captionEn: "Preparing sterile surgical medication" },
  { id: "img-8", src: "/pptx_images/slide13_img27.jpg", category: "operations", captionAr: "استشارة وتنسيق بين الأطباء داخل العمليات", captionEn: "Doctor consultation inside the operating room" },
  { id: "img-9", src: "/pptx_images/slide13_img30.jpg", category: "operations", captionAr: "مراجعة الأشعة المقطعية أثناء العملية", captionEn: "Reviewing CT scans during surgical procedure" },
  { id: "img-10", src: "/pptx_images/slide13_img32.jpg", category: "operations", captionAr: "جهاز المناظير الجراحية المتطور", captionEn: "Advanced surgical endoscopy system" },
  { id: "img-11", src: "/pptx_images/slide13_img28.jpg", category: "operations", captionAr: "منطقة التعقيم والغسيل الجراحي المزدوجة", captionEn: "Surgical scrub and sterilization area" },
  
  // Nursery (5 images)
  { id: "img-12", src: "/pptx_images/slide8_img7.jpg", category: "nursery", captionAr: "حضانة حديثي الولادة والأطفال المبتسرين", captionEn: "Neonatal incubator for premature infants" },
  { id: "img-13", src: "/pptx_images/slide8_img9.jpg", category: "nursery", captionAr: "ممرضة تقدم الرعاية المباشرة لمولود بالحضانة", captionEn: "Nurse providing direct care to newborn in incubator" },
  { id: "img-14", src: "/pptx_images/slide8_img8.jpg", category: "nursery", captionAr: "جهاز العلاج الضوئي لارتفاع نسبة الصفار لدى المواليد", captionEn: "Phototherapy device for neonatal jaundice" },
  { id: "img-15", src: "/pptx_images/slide8_img10.jpg", category: "nursery", captionAr: "وحدة الحضانة المتكاملة بمستشفى المبارك", captionEn: "Integrated NICU unit at Al-Mubarak Hospital" },
  { id: "img-16", src: "/pptx_images/slide8_img11.jpg", category: "nursery", captionAr: "جهاز تدفئة وميزان قياس وزن الأطفال المواليد", captionEn: "Infant warmer and baby weighing scale" },
  
  // Rooms (3 images)
  { id: "img-17", src: "/pptx_images/slide9_img12.jpg", category: "rooms", captionAr: "غرفة تنويم مجهزة بمراقبة العلامات الحيوية وأكسجين", captionEn: "Patient room with vital monitors and oxygen" },
  { id: "img-18", src: "/pptx_images/slide9_img13.jpg", category: "rooms", captionAr: "جناح تنويم مزدوج ذو إضاءة وتهوية ممتازة", captionEn: "Double inpatient ward with natural lighting" },
  { id: "img-19", src: "/pptx_images/slide9_img16.jpg", category: "rooms", captionAr: "غرفة التنويم الخاصة وأسرة المرضى", captionEn: "Private inpatient ward and beds" },
  
  // Pharmacy
  { id: "img-20", src: "/pptx_images/slide6_img6.jpg", category: "pharmacy", captionAr: "صيدلية المستشفى الرئيسية وتوفير العلاج المباشر", captionEn: "Main hospital pharmacy providing direct meds" },
  
  // Reception
  { id: "img-21", src: "/pptx_images/slide10_img17.jpg", category: "reception", captionAr: "صالة الانتظار والاستقبال الرئيسية بمستشفى المبارك", captionEn: "Main reception & waiting hall at Al-Mubarak Hospital" },
  { id: "img-22", src: "/pptx_images/slide10_img18.jpg", category: "reception", captionAr: "مكتب المدير العام د/ عبدالرحمن المبارك", captionEn: "General Director Dr. Abdulrahman Al-Mubarak office" },
  { id: "img-23", src: "/pptx_images/slide13_img29.jpg", category: "reception", captionAr: "غرفة الفحص المسبق والفرز الأولي للمرضى", captionEn: "Pre-examination & triage screening room" },
  
  // Nursing
  { id: "img-24", src: "/pptx_images/slide11_img19.jpg", category: "nursing", captionAr: "محطة التمريض الرئيسية وخدمة المرضى المنومين", captionEn: "Main nursing station serving inpatient wards" },
  { id: "img-25", src: "/pptx_images/slide11_img20.jpg", category: "nursing", captionAr: "ممر ومكتب التمريض بمبنى العيادات", captionEn: "Nursing corridor & station in clinic building" },
];

export default function PhotoGallery({ lang }: PhotoGalleryProps) {
  const t = translations[lang];
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = activeCategory === "all"
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeCategory);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1));
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredImages.length]);

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-burgundy-800 font-extrabold text-xs uppercase tracking-widest bg-burgundy-100 px-4 py-1.5 rounded-full border border-burgundy-200 shadow-sm">
          {t.galleryTitle}
        </span>
        <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight text-gradient-burgundy">
          {t.gallerySubtitle}
        </h2>
        <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
          {t.galleryDesc}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none px-2">
        {galleryCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = cat.id === "all" ? galleryImages.length : galleryImages.filter(i => i.category === cat.id).length;
          
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
                isActive
                  ? "bg-burgundy-900 text-white border-burgundy-800 shadow-md shadow-burgundy-900/15"
                  : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-burgundy-900"
              }`}
            >
              <DynamicIcon name={cat.icon as IconName} size={15} />
              <span>{lang === "ar" ? cat.labelAr : cat.labelEn}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((img, idx) => (
          <ScrollReveal key={img.id} direction="fade-up" delay={idx * 50}>
            <div
              onClick={() => setLightboxIndex(idx)}
              className="group relative bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer aspect-[4/3] flex flex-col justify-end"
            >
              <img
                src={img.src}
                alt={lang === "ar" ? img.captionAr : img.captionEn}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>

              {/* Zoom Icon Badge */}
              <div className="absolute top-3 end-3 p-2 bg-white/20 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-white/20">
                <DynamicIcon name="ZoomIn" size={16} />
              </div>

              {/* Caption Content */}
              <div className="relative z-10 p-4 space-y-1 text-start">
                <span className="inline-block px-2.5 py-0.5 bg-burgundy-600/80 text-white text-[10px] font-extrabold rounded-md backdrop-blur-sm">
                  {lang === "ar"
                    ? galleryCategories.find(c => c.id === img.category)?.labelAr
                    : galleryCategories.find(c => c.id === img.category)?.labelEn}
                </span>
                <p className="text-xs md:text-sm font-bold text-white leading-snug drop-shadow-sm">
                  {lang === "ar" ? img.captionAr : img.captionEn}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-fade-in">
          
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 end-5 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all cursor-pointer border border-white/20 z-10"
            title="إغلاق / Close"
          >
            <DynamicIcon name="X" size={20} />
          </button>

          {/* Previous Button */}
          <button
            onClick={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1))}
            className="absolute start-4 md:start-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all cursor-pointer border border-white/20 z-10"
            title="السابق / Previous"
          >
            <DynamicIcon name={lang === "ar" ? "ChevronRight" : "ChevronLeft"} size={22} />
          </button>

          {/* Next Button */}
          <button
            onClick={() => setLightboxIndex((prev) => (prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0))}
            className="absolute end-4 md:end-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all cursor-pointer border border-white/20 z-10"
            title="التالي / Next"
          >
            <DynamicIcon name={lang === "ar" ? "ChevronLeft" : "ChevronRight"} size={22} />
          </button>

          {/* Main Image Container */}
          <div className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center gap-4">
            <div className="relative rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl max-h-[70vh] bg-black">
              <img
                src={filteredImages[lightboxIndex].src}
                alt={lang === "ar" ? filteredImages[lightboxIndex].captionAr : filteredImages[lightboxIndex].captionEn}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="text-center space-y-1 text-white max-w-xl">
              <p className="text-sm md:text-base font-bold">
                {lang === "ar" ? filteredImages[lightboxIndex].captionAr : filteredImages[lightboxIndex].captionEn}
              </p>
              <p className="text-xs text-slate-400 font-mono">
                {lightboxIndex + 1} / {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
