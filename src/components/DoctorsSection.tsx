import React, { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import DynamicIcon from "./DynamicIcon";
import { Doctor } from "../types";

interface DoctorsSectionProps {
  doctors: Doctor[];
  lang: "ar" | "en";
  onBookClick: () => void;
}

export default function DoctorsSection({ doctors, lang, onBookClick }: DoctorsSectionProps) {
  const [filter, setFilter] = useState<"all" | "visiting" | "resident">("all");

  const filteredDoctors = doctors.filter((doc) => {
    if (filter === "visiting") return doc.isVisiting;
    if (filter === "resident") return !doc.isVisiting;
    return true;
  });

  return (
    <section className="space-y-8 animate-fade-in">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-burgundy-800 font-extrabold text-xs uppercase tracking-widest bg-burgundy-100 px-4 py-1.5 rounded-full border border-burgundy-200 shadow-sm inline-flex items-center gap-1.5">
          <DynamicIcon name="Stethoscope" size={14} />
          {lang === "ar" ? "برنامج الاستشاريين والأطباء" : "Clinical Faculty & Visiting Specialists"}
        </span>
        <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight text-gradient-burgundy">
          {lang === "ar" ? "نخبة الكوادر الطبية والاستشاريين الزائرين" : "Expert Medical Faculty & Visiting Specialists"}
        </h2>
        <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
          {lang === "ar"
            ? "استقطاب أرقى الكفاءات الطبية والاستشاريين في التخصصات الدقيقة والنادرة لتوطين العلاج بكسلا وتوفير مشقة السفر"
            : "Attracting elite clinical consultants and specialists to localize advanced care in Kassala without capital travel burdens"}
        </p>
      </div>

      {/* Filter Options */}
      <div className="flex justify-center gap-3">
        {[
          { id: "all", labelAr: "كافة الأطباء", labelEn: "All Faculty" },
          { id: "visiting", labelAr: "عيادة الاختصاصي الزائر ⭐", labelEn: "Visiting Consultants ⭐" },
          { id: "resident", labelAr: "الاستشاريون المقيمون", labelEn: "Resident Faculty" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              filter === f.id
                ? "bg-burgundy-900 text-white border-burgundy-800 shadow-md shadow-burgundy-900/15"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {lang === "ar" ? f.labelAr : f.labelEn}
          </button>
        ))}
      </div>

      {/* Doctors Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDoctors.map((doc, idx) => (
          <ScrollReveal key={doc.id} direction="fade-up" delay={idx * 80}>
            <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between h-full">
              <div>
                {/* Doctor Image Container */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  
                  {/* Badge */}
                  <div className="absolute top-3 start-3">
                    {doc.isVisiting ? (
                      <span className="px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full shadow-md flex items-center gap-1">
                        <DynamicIcon name="Sparkles" size={12} />
                        {lang === "ar" ? "اختصاصي زائر" : "Visiting Consultant"}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-burgundy-900 text-white text-[10px] font-bold rounded-full shadow-md">
                        {lang === "ar" ? "استشاري مقيم" : "Resident Staff"}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 start-3 end-3 text-white">
                    <p className="text-xs font-extrabold text-amber-300">{doc.specialty}</p>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-burgundy-900 transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {doc.title}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <DynamicIcon name="Clock" size={13} className="text-burgundy-700" />
                      <span>{lang === "ar" ? "مواعيد التواجد والعيادة:" : "Clinic Availability:"}</span>
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {doc.availableDays.map((day, dIdx) => (
                        <span key={dIdx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={onBookClick}
                  className="w-full py-2.5 bg-slate-50 hover:bg-burgundy-900 hover:text-white border border-slate-200 hover:border-burgundy-900 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <DynamicIcon name="Phone" size={14} />
                  <span>{lang === "ar" ? "حجز موعد بالعيادة" : "Book Clinic Appointment"}</span>
                </button>
              </div>

            </div>
          </ScrollReveal>
        ))}
      </div>

    </section>
  );
}
