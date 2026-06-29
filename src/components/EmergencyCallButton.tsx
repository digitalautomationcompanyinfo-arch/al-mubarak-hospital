import React, { useState } from "react";
import DynamicIcon from "./DynamicIcon";

interface EmergencyCallButtonProps {
  phoneNumber: string;
  lang: "ar" | "en";
}

export default function EmergencyCallButton({ phoneNumber, lang }: EmergencyCallButtonProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 start-6 z-50 md:hidden">
      {/* Expanded call info */}
      {expanded && (
        <div className="absolute bottom-16 start-0 bg-white rounded-2xl shadow-2xl border border-red-100 p-4 w-64 animate-scale-up">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-xl">
              <DynamicIcon name="AlertCircle" size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-red-700">
                {lang === "ar" ? "رقم الطوارئ" : "Emergency Line"}
              </p>
              <p className="text-[10px] text-slate-500">
                {lang === "ar" ? "متاح 24 ساعة" : "Available 24/7"}
              </p>
            </div>
          </div>
          <a
            href={`tel:${phoneNumber.replace(/\s/g, "")}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
          >
            <DynamicIcon name="Phone" size={16} className="text-white" />
            <span dir="ltr">{phoneNumber}</span>
          </a>
          <button
            onClick={() => setExpanded(false)}
            className="mt-2 w-full text-center text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            {lang === "ar" ? "إغلاق" : "Close"}
          </button>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setExpanded(!expanded)}
        aria-label={lang === "ar" ? "اتصال طوارئ" : "Emergency Call"}
        className={`p-3.5 rounded-full shadow-lg transition-all duration-300 cursor-pointer flex items-center gap-2 ${
          expanded
            ? "bg-white text-red-600 border-2 border-red-200 scale-110"
            : "bg-red-600 text-white animate-pulse hover:scale-110 shadow-red-500/30"
        }`}
      >
        <DynamicIcon name="Phone" size={22} />
        {!expanded && (
          <span className="text-[11px] font-black pe-1 hidden sm:inline">
            {lang === "ar" ? "طوارئ" : "EMERGENCY"}
          </span>
        )}
      </button>
    </div>
  );
}
