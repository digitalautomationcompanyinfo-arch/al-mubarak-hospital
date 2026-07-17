import React, { useState, useEffect } from "react";
import DynamicIcon from "./DynamicIcon";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top / العودة للأعلى"
      title="Back to top / العودة للأعلى"
      className={`fixed bottom-6 end-6 z-50 p-3 rounded-full bg-burgundy-900 text-white shadow-lg shadow-burgundy-900/25 border border-burgundy-800/20 transition-all duration-300 hover:bg-burgundy-800 hover:scale-110 cursor-pointer ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <DynamicIcon name="ChevronUp" size={20} />
    </button>
  );
}
