import React, { useState, useEffect } from "react";
import { NewsArticle, PatientFeedback } from "./types";
import { initialNews, initialDepartments, initialFeedbacks, mediaStats } from "./data/mockData";
import PublicPortal from "./components/PublicPortal";
import StaffPortal from "./components/StaffPortal";
import DynamicIcon from "./components/DynamicIcon";
import SEO from "./components/SEO";
import { translations, bilingualNews, bilingualDepartments, bilingualStats, bilingualFeedbacks } from "./data/translations";

export default function App() {
  // Language State
  const [lang, setLang] = useState<"ar" | "en">("ar");

  // Shared States
  const [newsList, setNewsList] = useState<NewsArticle[]>(initialNews);
  const [feedbackList, setFeedbackList] = useState<PatientFeedback[]>(initialFeedbacks);
  
  // Navigation States
  const [isStaffMode, setIsStaffMode] = useState(false);
  const [activePublicTab, setActivePublicTab] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Staff Login Modal States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const t = translations[lang];

  // Handler: Add feedback from public contact form
  const handleAddFeedback = (newFb: Omit<PatientFeedback, "id" | "date" | "status">) => {
    const formattedFb: PatientFeedback = {
      ...newFb,
      id: `fb-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      status: "pending"
    };
    setFeedbackList((prev) => [formattedFb, ...prev]);
  };

  // Handler: Update feedback status with AI-suggested reply
  const handleUpdateFeedbackStatus = (id: string, replyText: string) => {
    setFeedbackList((prev) =>
      prev.map((fb) => (fb.id === id ? { ...fb, status: "replied", replyText } : fb))
    );
  };

  // Handler: Delete feedback
  const handleDeleteFeedback = (id: string) => {
    setFeedbackList((prev) => prev.filter((fb) => fb.id !== id));
  };

  // Handler: Publish News from AI Press Release
  const handlePublishNews = (newNews: Omit<NewsArticle, "id" | "date" | "isPublishedByStaff">) => {
    const formattedNews: NewsArticle = {
      ...newNews,
      id: `news-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      isPublishedByStaff: true,
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80" // Modern hospital stock image
    };
    setNewsList((prev) => [formattedNews, ...prev]);
  };

  // Handle login via API
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput || isLoggingIn) return;

    setIsLoggingIn(true);
    setLoginError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setAuthToken(data.token);
        setIsStaffMode(true);
        setShowLoginModal(false);
        setPasswordInput("");
      } else {
        setLoginError(
          data.error ||
            (lang === "ar"
              ? "كلمة المرور غير صحيحة! جرب الرقم 1234 للدخول التجريبي."
              : "Incorrect passcode! Try '1234' for demo login.")
        );
      }
    } catch (err) {
      // Fallback to local check if server is unreachable
      if (passwordInput === "1234") {
        setIsStaffMode(true);
        setShowLoginModal(false);
        setPasswordInput("");
        setLoginError("");
      } else {
        setLoginError(
          lang === "ar"
            ? "تعذر الاتصال بالخادم. جرب الرقم 1234 للدخول التجريبي دون اتصال."
            : "Cannot reach server. Try '1234' for offline demo login."
        );
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    if (authToken) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: authToken }),
        });
      } catch {
        // Ignore logout API errors
      }
    }
    setAuthToken(null);
    setIsStaffMode(false);
  };

  // Get translated datasets
  const translatedNews = bilingualNews(lang, newsList);
  const translatedDepts = bilingualDepartments(lang, initialDepartments);
  const translatedStats = bilingualStats(lang, mediaStats);
  const translatedFeedbacks = bilingualFeedbacks(lang, feedbackList);

  return (
    <div 
      className="min-h-screen flex flex-col bg-beige-50 text-slate-800 transition-all duration-300 antialiased font-sans" 
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      
      <SEO lang={lang} />

      {/* 1. TOP STATS BAR & PUBLIC HEALTH TICKER */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 text-slate-100 text-xs py-2.5 px-4 md:px-8 border-b border-slate-800/45 shadow-sm overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Health Alert Ticker */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="bg-burgundy-600/15 text-burgundy-500 text-[11px] px-2.5 py-0.5 rounded-full border border-burgundy-600/20 font-bold tracking-wide animate-pulse shrink-0">
              {t.healthAlert}
            </span>
            <div className="ticker-wrapper text-slate-300 text-xs flex-1 md:w-96">
              <div className={`ticker-track ${lang === "ar" ? "ticker-reverse" : ""}`}>
                <span className="ticker-item">{t.tickerText}</span>
                <span className="ticker-item">{t.tickerText}</span>
                <span className="ticker-item">{t.tickerText}</span>
              </div>
            </div>
          </div>

          {/* Location & Quick Contact */}
          <div className="flex items-center gap-5 text-beige-300 font-medium text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <DynamicIcon name="MapPin" size={13} className="text-burgundy-600 shrink-0" />
              {t.hqLocation}
            </span>
            <span className="text-burgundy-800 hidden md:inline">|</span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors" dir="ltr">
              <DynamicIcon name="Phone" size={13} className="text-burgundy-600 shrink-0" />
              {t.phoneNum}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100/80 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-burgundy-900 to-burgundy-700 rounded-2xl flex items-center justify-center shadow-lg shadow-burgundy-900/10 shrink-0 border border-burgundy-800/10">
              <DynamicIcon name="HeartPulse" size={20} className="text-white" />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-base md:text-lg font-black text-slate-900 tracking-tight leading-tight">
                {t.hospitalName}
              </h1>
              <p className="text-[10px] md:text-xs text-burgundy-700 font-bold tracking-wider uppercase">
                {t.deptName}
              </p>
            </div>
          </div>

          {/* Desktop Navigation (Only shown in Public Mode) */}
          {!isStaffMode && (
            <nav className="hidden lg:flex items-center gap-2 text-sm font-semibold">
              {[
                { id: "home", label: t.tabHome, icon: "Compass" },
                { id: "departments", label: t.tabDepts, icon: "HeartPulse" },
                { id: "news", label: t.tabNews, icon: "Megaphone" },
                { id: "contact", label: t.tabContact, icon: "MessageSquare" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePublicTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer text-xs md:text-sm font-bold ${
                    activePublicTab === tab.id
                      ? "bg-burgundy-100/70 text-burgundy-900 shadow-sm shadow-burgundy-200"
                      : "text-slate-600 hover:text-burgundy-900 hover:bg-slate-50"
                  }`}
                >
                  <DynamicIcon name={tab.icon as any} size={14} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          )}

          {/* Portal Mode Controls & Language Switcher */}
          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 border border-slate-200/65 shadow-sm cursor-pointer hover:border-slate-300"
              title="Change Language / تغيير اللغة"
              id="lang-switcher-btn"
            >
              <DynamicIcon name="Globe" size={14} className="text-slate-500" />
              <span className="font-sans uppercase text-[11px] font-extrabold">{lang === "ar" ? "English" : "عربي"}</span>
            </button>

            <button
              onClick={() => {
                setActivePublicTab("contact");
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2 bg-burgundy-800 hover:bg-burgundy-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-burgundy-800/15 border border-burgundy-900/20 cursor-pointer"
              id="appointment-btn"
            >
              <DynamicIcon name="Phone" size={14} className="text-white" />
              <span>{t.bookAppointment}</span>
            </button>

            {isStaffMode ? (
              // Inside staff portal - Show LogOut Button
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 border border-rose-200/60 cursor-pointer shadow-sm shadow-rose-100/50"
                id="staff-logout-btn"
              >
                <DynamicIcon name="LogOut" size={14} />
                <span>{t.backToPublic}</span>
              </button>
            ) : (
              // Public site - Show Staff Portal Button
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setLoginError("");
                  setPasswordInput("");
                }}
                className="px-4 py-2 bg-gradient-to-r from-burgundy-900 to-burgundy-800 hover:from-burgundy-750 hover:to-sky-650 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-burgundy-900/10 border border-burgundy-850/20 cursor-pointer"
                id="staff-login-trigger"
              >
                <DynamicIcon name="LayoutDashboard" size={14} />
                <span className="hidden sm:inline">{t.staffPortal}</span>
                <span className="sm:hidden">{t.staffPortalMobile}</span>
              </button>
            )}

            {/* Mobile Hamburger menu (Only for public view) */}
            {!isStaffMode && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 bg-slate-50 text-slate-700 rounded-xl border border-slate-200 lg:hidden hover:bg-slate-100 transition-colors cursor-pointer"
                id="mobile-nav-toggle"
              >
                <DynamicIcon name={mobileMenuOpen ? "X" : "Menu"} size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {!isStaffMode && mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white p-4 space-y-1.5 shadow-xl animate-fade-in">
            {[
              { id: "home", label: t.tabHome, icon: "Compass" },
              { id: "departments", label: t.tabDepts, icon: "HeartPulse" },
              { id: "news", label: t.tabNews, icon: "Megaphone" },
              { id: "contact", label: t.tabContact, icon: "MessageSquare" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActivePublicTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-start ${
                  activePublicTab === tab.id
                    ? "bg-burgundy-900 text-white shadow-md shadow-burgundy-850/10"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <DynamicIcon name={tab.icon as any} size={15} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* 3. CORE PAGE WRAPPER & CONTAINER */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {isStaffMode ? (
          /* Render internal Media & PR dashboard */
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-gradient-to-br from-burgundy-950 via-[#3D0C0C] to-burgundy-850 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-burgundy-850/30 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-2 text-center md:text-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-burgundy-600/15 border border-burgundy-600/25 text-burgundy-400 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy-500 animate-ping"></span>
                  {t.activeStaffBoard}
                </span>
                <h2 className="text-xl md:text-3xl font-black text-white leading-snug">{t.staffPortalTitle}</h2>
                <p className="text-xs md:text-sm text-slate-300/85 max-w-xl">{t.staffPortalSub}</p>
              </div>
              <div className="flex items-center gap-4 bg-white/5 px-5 py-3.5 rounded-2xl border border-white/10 shrink-0">
                <div className="text-[10px] font-mono text-beige-300 leading-relaxed text-start">
                  <p>{t.staffHqAddress}</p>
                  <p>{t.staffHqState}</p>
                </div>
                <div className="p-2.5 bg-white/10 text-white rounded-xl border border-white/5">
                  <DynamicIcon name="Building" size={18} />
                </div>
              </div>
            </div>

            <StaffPortal
              news={newsList}
              feedbacks={feedbackList}
              stats={mediaStats}
              lang={lang}
              onPublishNews={handlePublishNews}
              onUpdateFeedbackStatus={handleUpdateFeedbackStatus}
              onDeleteFeedback={handleDeleteFeedback}
            />
          </div>
        ) : (
          /* Render public hospital showcase portal */
          <PublicPortal
            news={translatedNews}
            departments={translatedDepts}
            onAddFeedback={handleAddFeedback}
            activeSubTab={activePublicTab}
            setActiveSubTab={setActivePublicTab}
            lang={lang}
          />
        )}
      </main>

      {/* 4. STAFF LOGIN MODAL (Simulated Hospital Security) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 transform transition-all animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-[#1A0505] to-burgundy-850 text-white p-8 text-center space-y-3.5 relative">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError("");
                  setPasswordInput("");
                }}
                className="absolute top-5 end-5 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all cursor-pointer"
                id="close-login-modal"
              >
                <DynamicIcon name="X" size={15} />
              </button>
              
              <div className="mx-auto w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-inner">
                <DynamicIcon name="LayoutDashboard" size={20} />
              </div>
              <h3 className="text-lg font-black text-white leading-snug">{t.loginTitle}</h3>
              <p className="text-xs text-slate-300/80 leading-relaxed">
                {t.loginDesc}
              </p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleLoginSubmit} className="p-6 md:p-8 space-y-5">
              <div className="space-y-2 text-start">
                <label className="text-xs font-bold text-slate-700 block">{t.passcodeLabel}</label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder={t.passcodePlaceholder}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono focus:outline-none focus:border-burgundy-800 focus:bg-white text-burgundy-950 font-bold text-sm tracking-widest shadow-inner transition-colors"
                />
              </div>

              {loginError && (
                <p className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100 text-start">
                  {loginError}
                </p>
              )}

              {/* Demo Hint */}
              <div className="bg-slate-50 p-4 rounded-xl space-y-1.5 border border-slate-100 text-start">
                <p className="text-xs font-bold text-burgundy-950 flex items-center gap-1 justify-start">
                  <DynamicIcon name="Bot" size={14} className="text-burgundy-900" />
                  <span>{t.demoCodeTitle}</span>
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  {lang === "ar" ? (
                    <>للدخول السريع ومعاينة أدوات الذكاء الاصطناعي، يرجى كتابة الرمز: <strong className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-slate-200 text-burgundy-850 font-extrabold">1234</strong> واضغط تسجيل الدخول.</>
                  ) : (
                    <>To login quickly and preview the AI features, please type passcode: <strong className="font-mono text-xs bg-white px-2 py-0.5 rounded border border-slate-200 text-burgundy-850 font-extrabold">1234</strong> and press submit.</>
                  )}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 bg-gradient-to-r from-burgundy-900 to-burgundy-800 hover:from-burgundy-750 hover:to-sky-650 text-white font-bold rounded-xl transition-all shadow-md shadow-burgundy-900/10 text-xs cursor-pointer border border-burgundy-850/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoggingIn ? (
                    <span className="flex items-center justify-center gap-2">
                      <DynamicIcon name="Sparkles" size={14} className="animate-spin" />
                      {lang === "ar" ? "جاري التحقق..." : "Verifying..."}
                    </span>
                  ) : (
                    t.loginSubmit
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. PUBLIC FOOTER */}
      <footer className="bg-burgundy-950 text-beige-100 border-t border-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Col 1: About Hospital */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-beige-200 border border-white/5 shadow-inner">
                <DynamicIcon name="HeartPulse" size={20} className="text-beige-200" />
              </div>
              <h4 className="text-lg font-bold text-white tracking-tight">{t.footerAboutTitle}</h4>
            </div>
            
            <p className="text-xs text-slate-300/75 leading-relaxed max-w-sm">
              {t.footerAboutDesc}
            </p>

            <div className="space-y-2 pt-2 text-[11px] sm:text-xs text-slate-300/80 font-medium">
              <p className="flex items-center gap-2">
                <DynamicIcon name="MapPin" size={14} className="text-burgundy-600 shrink-0" />
                <span>{t.footerGeoLoc}</span>
              </p>
              <p className="flex items-center gap-2">
                <DynamicIcon name="Clock" size={14} className="text-burgundy-600 shrink-0" />
                <span>{t.footerRecepHours}</span>
              </p>
            </div>
          </div>

          {/* Col 2: Useful links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-beige-100 uppercase tracking-widest pb-1 border-b border-white/5 w-max me-auto">
              {t.footerQuickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs text-beige-300/75 font-medium">
              <li>
                <button onClick={() => { setIsStaffMode(false); setActivePublicTab("home"); }} className="hover:text-white transition-colors cursor-pointer">
                  {t.footerLinkHome}
                </button>
              </li>
              <li>
                <button onClick={() => { setIsStaffMode(false); setActivePublicTab("departments"); }} className="hover:text-white transition-colors cursor-pointer">
                  {t.footerLinkDepts}
                </button>
              </li>
              <li>
                <button onClick={() => { setIsStaffMode(false); setActivePublicTab("news"); }} className="hover:text-white transition-colors cursor-pointer">
                  {t.footerLinkNews}
                </button>
              </li>
              <li>
                <button onClick={() => { setIsStaffMode(false); setActivePublicTab("contact"); }} className="hover:text-white transition-colors cursor-pointer">
                  {t.footerLinkContact}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Media Desk Contact */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-beige-100 pb-1 border-b border-white/5 w-max me-auto">
              {t.footerSpokeTitle}
            </h4>
            <p className="text-xs text-beige-300/75 leading-relaxed">
              {t.footerSpokeDesc}
            </p>
            
            <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 justify-between">
                <span className="text-beige-300/75">{t.footerSpokePhoneLabel}</span>
                <span dir="ltr" className="font-semibold text-white">+249 912 34567</span>
              </div>
              <div className="flex items-center gap-2 justify-between">
                <span className="text-beige-300/75">{t.footerSpokeEmailLabel}</span>
                <span className="font-semibold text-white">media@al-mubarak.org</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="bg-burgundy-950 border-t border-white/5 py-6 text-center text-xs text-beige-300/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>{t.footerCopyright}</p>
            <a
              href="https://www.digital-automation.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans font-bold text-[10px] text-rose-500/80 hover:text-rose-400 tracking-wide uppercase transition-colors"
            >
              {t.footerDeveloperCredit}
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
