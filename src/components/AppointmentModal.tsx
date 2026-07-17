import React, { useState } from "react";
import DynamicIcon from "./DynamicIcon";
import toast from "react-hot-toast";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "ar" | "en";
}

export default function AppointmentModal({ isOpen, onClose, lang }: AppointmentModalProps) {
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [clinic, setClinic] = useState("obstetrics");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !phone) return;

    // Send appointment request via WhatsApp
    const message = lang === "ar"
      ? `مرحباً مستشفى المبارك التخصصي، أرغب في حجز موعد كشف بكسلا:\n- الاسم: ${patientName}\n- الهاتف: ${phone}\n- العيادة المطلوبة: ${clinic}\n- التاريخ الفضل: ${date || "أقرب موعد"}\n- ملاحظات: ${notes || "لا يوجد"}`
      : `Hello Al-Mubarak Hospital, I would like to book a clinic appointment in Kassala:\n- Name: ${patientName}\n- Phone: ${phone}\n- Clinic: ${clinic}\n- Preferred Date: ${date || "Earliest available"}\n- Notes: ${notes || "None"}`;

    const whatsappUrl = `https://wa.me/249100121111?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    toast.success(
      lang === "ar"
        ? "تم تحويل طلب الحجز للواتساب الخاص بمكتب الاستعلامات بنجاح!"
        : "Appointment request opened in WhatsApp desk!"
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-scale-up">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-burgundy-950 via-[#3D0C0C] to-burgundy-850 text-white p-6 md:p-8 space-y-2 relative text-start">
          <button
            onClick={onClose}
            className="absolute top-5 end-5 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
          >
            <DynamicIcon name="X" size={16} />
          </button>
          
          <div className="inline-flex p-2.5 bg-white/10 rounded-2xl border border-white/10 text-amber-300 shadow-inner">
            <DynamicIcon name="Calendar" size={20} />
          </div>
          <h3 className="text-xl font-black text-white">
            {lang === "ar" ? "حجز موعد بالعيادات الاستشارية" : "Book a Specialized Clinic Appointment"}
          </h3>
          <p className="text-xs text-slate-300/80 leading-relaxed font-light">
            {lang === "ar"
              ? "مستشفى المبارك التخصصي - حجز موعدك يستغرق دقيقة واحدة"
              : "Al-Mubarak Specialized Hospital - Takes less than a minute"}
          </p>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4 text-start">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              {lang === "ar" ? "اسم المريض الثلاثي *" : "Patient Full Name *"}
            </label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder={lang === "ar" ? "أدخل الاسم هنا..." : "Enter full name..."}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-burgundy-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              {lang === "ar" ? "رقم الهاتف والواتساب *" : "Phone & WhatsApp Number *"}
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912345678"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-burgundy-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              {lang === "ar" ? "اختر العيادة المطلوبة *" : "Select Required Clinic *"}
            </label>
            <select
              value={clinic}
              onChange={(e) => setClinic(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-burgundy-800"
            >
              <option value={lang === "ar" ? "النساء والتوليد والعقم" : "OB/GYN & Infertility"}>
                {lang === "ar" ? "عيادة أمراض النساء والتوليد والعقم" : "OB/GYN & Infertility Clinic"}
              </option>
              <option value={lang === "ar" ? "طب الأطفال والحضانة" : "Pediatrics & NICU"}>
                {lang === "ar" ? "عيادة طب وصحة الطفل" : "Pediatrics & Neonatal Care Clinic"}
              </option>
              <option value={lang === "ar" ? "جراحة المخ والأعصاب (زائر)" : "Neurosurgery (Visiting)"}>
                {lang === "ar" ? "عيادة جراحة المخ والأعصاب (اختصاصي زائر)" : "Neurosurgery & Spine Clinic (Visiting Consultant)"}
              </option>
              <option value={lang === "ar" ? "جراحة المسالك وزراعة الكلى (زائر)" : "Urology (Visiting)"}>
                {lang === "ar" ? "عيادة المسالك البولية وزراعة الكلى" : "Urology & Kidney Transplant Clinic (Visiting Consultant)"}
              </option>
              <option value={lang === "ar" ? "جراحة العظام والإصابات" : "Orthopedic Surgery"}>
                {lang === "ar" ? "عيادة جراحة العظام والإصابات" : "Orthopedics & Trauma Surgery Clinic"}
              </option>
              <option value={lang === "ar" ? "الجراحة العامة والمناظير" : "General Surgery"}>
                {lang === "ar" ? "عيادة الجراحة العامة والمناظير" : "General & Laparoscopic Surgery Clinic"}
              </option>
              <option value={lang === "ar" ? "الباطنية وأمراض الكلى" : "Internal Medicine"}>
                {lang === "ar" ? "عيادة الباطنية وأمراض الكلى" : "Internal Medicine & Nephrology Clinic"}
              </option>
              <option value={lang === "ar" ? "الروماتيزم والمناعة" : "Rheumatology"}>
                {lang === "ar" ? "عيادة المناعة السريرية والروماتيزم" : "Clinical Immunology & Rheumatology Clinic"}
              </option>
              <option value={lang === "ar" ? "الأشعة المقطعية (CT Scan)" : "CT Scan & Radiology"}>
                {lang === "ar" ? "قسم الأشعة المقطعية والأشعة الرقمية" : "Radiology & Multi-Slice CT Scan Unit"}
              </option>
              <option value={lang === "ar" ? "المعمل والأنسجة" : "Laboratory & Histopathology"}>
                {lang === "ar" ? "قسم المعمل وفحوصات الأنسجة" : "Diagnostic Laboratory & Histopathology"}
              </option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              {lang === "ar" ? "التاريخ المفضل للزيارة" : "Preferred Date"}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-burgundy-800 text-slate-700"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-burgundy-900 to-burgundy-800 hover:from-burgundy-800 hover:to-burgundy-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <DynamicIcon name="Send" size={15} />
              <span>{lang === "ar" ? "تأكيد وإرسال طلب الحجز" : "Confirm & Submit Appointment"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
