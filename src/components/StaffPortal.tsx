import React, { useState } from "react";
import toast from "react-hot-toast";
import { NewsArticle, PatientFeedback, MediaStat } from "../types";
import DynamicIcon, { IconName } from "./DynamicIcon";
import ScrollReveal from "./ScrollReveal";
import AnimatedCounter from "./AnimatedCounter";
import { translations } from "../data/translations";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface StaffPortalProps {
  news: NewsArticle[];
  feedbacks: PatientFeedback[];
  stats: MediaStat[];
  onPublishNews: (news: Omit<NewsArticle, "id" | "date" | "isPublishedByStaff">) => void;
  onUpdateFeedbackStatus: (id: string, replyText: string) => void;
  onDeleteFeedback: (id: string) => void;
  lang: "ar" | "en";
  authToken?: string | null;
}

export default function StaffPortal({
  news,
  feedbacks,
  stats,
  onPublishNews,
  onUpdateFeedbackStatus,
  onDeleteFeedback,
  lang,
  authToken
}: StaffPortalProps) {
  const t = translations[lang];

  // Compute chartData over a rolling 7-day period up to June 26, 2026
  const chartData = React.useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const baseDate = new Date(2026, 5, 26); // June 26, 2026
      baseDate.setDate(baseDate.getDate() - i);
      const yyyy = baseDate.getFullYear();
      const mm = String(baseDate.getMonth() + 1).padStart(2, '0');
      const dd = String(baseDate.getDate()).padStart(2, '0');
      days.push(`${yyyy}-${mm}-${dd}`);
    }

    // Historical background baseline counts to populate the chart with realistic numbers
    const historicalBaseline: Record<string, { inquiry: number; complaint: number; thank: number; suggestion: number }> = {
      "2026-06-20": { inquiry: 4, complaint: 1, thank: 3, suggestion: 2 },
      "2026-06-21": { inquiry: 5, complaint: 2, thank: 2, suggestion: 1 },
      "2026-06-22": { inquiry: 3, complaint: 1, thank: 4, suggestion: 3 },
      "2026-06-23": { inquiry: 6, complaint: 2, thank: 1, suggestion: 2 },
      "2026-06-24": { inquiry: 4, complaint: 3, thank: 3, suggestion: 1 },
      "2026-06-25": { inquiry: 7, complaint: 2, thank: 5, suggestion: 3 },
      "2026-06-26": { inquiry: 3, complaint: 1, thank: 2, suggestion: 1 },
    };

    return days.map(dateStr => {
      const baseline = historicalBaseline[dateStr] || { inquiry: 0, complaint: 0, thank: 0, suggestion: 0 };
      
      // Count live feedbacks for this date
      const liveInquiry = feedbacks.filter(fb => fb.date === dateStr && fb.type === "inquiry").length;
      const liveComplaint = feedbacks.filter(fb => fb.date === dateStr && fb.type === "complaint").length;
      const liveThank = feedbacks.filter(fb => fb.date === dateStr && fb.type === "thank").length;
      const liveSuggestion = feedbacks.filter(fb => fb.date === dateStr && fb.type === "suggestion").length;

      // Format date label for display based on locale
      let displayDate = dateStr;
      try {
        const [,, d] = dateStr.split("-");
        const monthsAr = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
        const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dateObj = new Date(dateStr);
        if (!isNaN(dateObj.getTime())) {
          const monthIndex = dateObj.getMonth();
          const dayNum = parseInt(d, 10);
          displayDate = lang === "ar" 
            ? `${dayNum} ${monthsAr[monthIndex]}`
            : `${monthsEn[monthIndex]} ${dayNum}`;
        }
      } catch (e) {
        // Fallback to raw string
      }

      // Sum baseline and live state to show feedback counts
      let inquiryCount = baseline.inquiry + liveInquiry;
      let complaintCount = baseline.complaint + liveComplaint;
      let thankCount = baseline.thank + liveThank;
      let suggestionCount = baseline.suggestion + liveSuggestion;

      // Adjust baseline for initial mock feedbacks to prevent double counting
      if (dateStr === "2026-06-25") inquiryCount = Math.max(0, inquiryCount - 1);
      if (dateStr === "2026-06-24") complaintCount = Math.max(0, complaintCount - 1);
      if (dateStr === "2026-06-23") thankCount = Math.max(0, thankCount - 1);

      return {
        dateStr,
        name: displayDate,
        [lang === "ar" ? "استفسارات" : "Inquiries"]: inquiryCount,
        [lang === "ar" ? "شكاوى" : "Complaints"]: complaintCount,
        [lang === "ar" ? "رسائل شكر" : "Appreciation"]: thankCount,
        [lang === "ar" ? "اقتراحات" : "Suggestions"]: suggestionCount,
        [lang === "ar" ? "إجمالي الوارد" : "Total"]: inquiryCount + complaintCount + thankCount + suggestionCount
      };
    });
  }, [feedbacks, lang]);

  // Staff Portal Active Tab
  const [activeTab, setActiveTab] = useState<"dashboard" | "press" | "social" | "inbox">("dashboard");

  // --- AI PRESS RELEASE STATE ---
  const [pressTopic, setPressTopic] = useState("");
  const [pressPoints, setPressPoints] = useState("");
  const [pressTone, setPressTone] = useState("رسمية ومهنية وقورة");
  const [pressResult, setPressResult] = useState("");
  const [isGeneratingPress, setIsGeneratingPress] = useState(false);
  const [copiedPress, setCopiedPress] = useState(false);
  const [publishedPress, setPublishedPress] = useState(false);

  // --- AI SOCIAL MEDIA STATE ---
  const [socialSource, setSocialSource] = useState("");
  const [socialPlatform, setSocialPlatform] = useState("جميع المنصات (فيسبوك، إكس، وواتساب)");
  const [socialResult, setSocialResult] = useState("");
  const [isGeneratingSocial, setIsGeneratingSocial] = useState(false);
  const [copiedSocial, setCopiedSocial] = useState(false);

  // --- INBOX STATE ---
  const [selectedFeedback, setSelectedFeedback] = useState<PatientFeedback | null>(null);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [replySuggestion, setReplySuggestion] = useState("");
  const [editedReply, setEditedReply] = useState("");
  const [inboxSuccessMessage, setInboxSuccessMessage] = useState("");
  const [selectedBulkFeedbackIds, setSelectedBulkFeedbackIds] = useState<string[]>([]);

  // Helper to call backend AI Press Release Generator
  const handleGeneratePressRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pressTopic) return;

    setIsGeneratingPress(true);
    setPressResult("");
    setPublishedPress(false);

    try {
      const response = await fetch("/api/generate-press-release", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken ? `Bearer ${authToken}` : ""
        },
        body: JSON.stringify({
          topic: pressTopic,
          keyPoints: pressPoints,
          tone: pressTone
        })
      });
      const data = await response.json();
      if (response.ok && data.result) {
        setPressResult(data.result);
        toast.success(
          lang === "ar" ? "✅ تم توليد البيان الصحفي بنجاح!" : "✅ Press release generated successfully!"
        );
      } else {
        const errMsg = data.error || (lang === "ar" ? "يرجى التحقق من مفتاح API" : "Please verify the API Key");
        setPressResult(
          lang === "ar" ? `⚠️ فشل التوليد: ${errMsg}` : `⚠️ Generation failed: ${errMsg}`
        );
        toast.error(
          lang === "ar" ? "❌ فشل توليد البيان الصحفي" : "❌ Failed to generate press release"
        );
      }
    } catch (err: any) {
      console.error(err);
      setPressResult(
        lang === "ar"
          ? `⚠️ حدث خطأ في الشبكة: ${err.message || "فشل الاتصال"}`
          : `⚠️ Network error: ${err.message || "Connection failed"}`
      );
      toast.error(
        lang === "ar" ? "⚠️ تعذر الاتصال بالخادم" : "⚠️ Could not reach the server"
      );
    } finally {
      setIsGeneratingPress(false);
    }
  };

  // Helper to publish AI press release to public news
  const handlePublishToPublic = () => {
    if (!pressResult || !pressTopic) return;

    // Create a clean public excerpt from the result
    const titleRegex = /^#\s+(.+)$/m;
    const titleMatch = pressResult.match(titleRegex);
    const finalTitle = titleMatch ? titleMatch[1] : pressTopic;

    // Remove titles for the published excerpt to keep it clean
    const cleanContent = pressResult.replace(/^#+.*$/gm, "").trim();
    const excerpt = cleanContent.slice(0, 150) + "...";

    onPublishNews({
      title: finalTitle,
      excerpt,
      content: pressResult,
      category: "بيان صحفي"
    });

    setPublishedPress(true);
    toast.success(
      lang === "ar" ? "📰 تم نشر البيان في الموقع العام!" : "📰 Press release published to public site!"
    );
    setTimeout(() => {
      setPublishedPress(false);
    }, 5000);
  };

  // Helper to call backend AI Social Media Generator
  const handleGenerateSocialPosts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialSource) return;

    setIsGeneratingSocial(true);
    setSocialResult("");

    try {
      const response = await fetch("/api/generate-social-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken ? `Bearer ${authToken}` : ""
        },
        body: JSON.stringify({
          sourceText: socialSource,
          platform: socialPlatform
        })
      });
      const data = await response.json();
      if (response.ok && data.result) {
        setSocialResult(data.result);
        toast.success(
          lang === "ar" ? "✅ تم صياغة منشورات السوشيال ميديا!" : "✅ Social media posts drafted successfully!"
        );
      } else {
        setSocialResult(
          lang === "ar"
            ? `⚠️ فشل التوليد: ${data.error || "يرجى التحقق من مفتاح API"}`
            : `⚠️ Generation failed: ${data.error || "Please check API key configuration"}`
        );
        toast.error(lang === "ar" ? "❌ فشلت صياغة المنشورات" : "❌ Failed to draft posts");
      }
    } catch (err: any) {
      console.error(err);
      setSocialResult(
        lang === "ar"
          ? `⚠️ خطأ بالاتصال بالخادم: ${err.message}`
          : `⚠️ Connection error: ${err.message}`
      );
      toast.error(lang === "ar" ? "⚠️ تعذر الاتصال بالخادم" : "⚠️ Could not reach the server");
    } finally {
      setIsGeneratingSocial(false);
    }
  };

  // Helper to call backend patient reply suggestion
  const handleGenerateReplySuggestion = async (feedback: PatientFeedback) => {
    setIsGeneratingReply(true);
    setReplySuggestion("");
    setEditedReply("");

    try {
      const response = await fetch("/api/suggest-patient-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken ? `Bearer ${authToken}` : ""
        },
        body: JSON.stringify({
          inquiryText: feedback.message,
          type: feedback.type
        })
      });
      const data = await response.json();
      if (response.ok && data.result) {
        setReplySuggestion(data.result);
        setEditedReply(data.result);
        toast.success(
          lang === "ar" ? "✅ تم اقتراح رد ذكي. يمكنك تعديله قبل الاعتماد." : "✅ Smart reply suggested. You can edit before approving."
        );
      } else {
        const errText = lang === "ar" ? `⚠️ فشل صياغة الرد: ${data.error}` : `⚠️ Failed to draft reply: ${data.error}`;
        setReplySuggestion(errText);
        setEditedReply(errText);
        toast.error(lang === "ar" ? "❌ فشلت صياغة الرد" : "❌ Failed to draft reply");
      }
    } catch (err: any) {
      console.error(err);
      const errText = lang === "ar" ? `⚠️ خطأ بالاتصال: ${err.message}` : `⚠️ Connection error: ${err.message}`;
      setReplySuggestion(errText);
      setEditedReply(errText);
      toast.error(lang === "ar" ? "⚠️ تعذر الاتصال بالخادم" : "⚠️ Could not reach server");
    } finally {
      setIsGeneratingReply(false);
    }
  };

  // Approve and save response to message
  const handleApproveReply = (id: string) => {
    if (!editedReply) return;

    onUpdateFeedbackStatus(id, editedReply);
    toast.success(
      lang === "ar" ? "✅ تم اعتماد الرد وإرساله للمواطن بنجاح" : "✅ Reply approved & sent to citizen successfully"
    );
    setInboxSuccessMessage(
      lang === "ar"
        ? "تم اعتماد الرد الطبي وتعديل حالة الرسالة إلى 'تم الرد' بنجاح!"
        : "Medical response approved and status updated to 'Replied' successfully!"
    );
    setSelectedFeedback(null);
    setReplySuggestion("");
    setEditedReply("");

    setTimeout(() => {
      setInboxSuccessMessage("");
    }, 5000);
  };

  // Clipboard copy utilities
  const copyToClipboard = (text: string, setCopiedFlag: (flag: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopiedFlag(true);
    setTimeout(() => {
      setCopiedFlag(false);
    }, 2500);
  };

  const alignClass = "text-start";

  return (
    <div className="space-y-8 animate-fade-in w-full">
      
      {/* Tab Selector inside Staff Portal */}
      <div className="glass border border-slate-100 p-2 rounded-2xl shadow-sm flex flex-wrap gap-2">
        {[
          { id: "dashboard", label: t.panelDashboard, icon: "LayoutDashboard" },
          { id: "press", label: t.panelPress, icon: "FileText" },
          { id: "social", label: t.panelSocial, icon: "Megaphone" },
          { id: "inbox", label: t.panelInbox, icon: "MessageSquare", count: feedbacks.filter(f => f.status === "pending").length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id !== "inbox") setSelectedFeedback(null);
            }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-burgundy-850 text-white shadow-md shadow-burgundy-850/10"
                : "text-slate-600 hover:bg-slate-50 hover:text-burgundy-850"
            }`}
          >
            <DynamicIcon name={tab.icon as IconName} size={15} />
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="bg-burgundy-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* --- STAFF PORTAL CONTENTS --- */}

      {/* 1. STAFF DASHBOARD TAB */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          {/* Header */}
          <ScrollReveal direction="fade-up" delay={50}>
            <div className={`space-y-1.5 ${alignClass}`}>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 text-gradient-burgundy">{t.statsTitle}</h2>
              <p className="text-xs text-slate-500 font-medium">
                {lang === "ar" 
                  ? "إحصاءات شاملة لتغطيتنا الصحفية وأداء الردود والتواصل مع المواطنين."
                  : "Comprehensive analytics of our press coverage, response efficiency, and citizen outreach."}
              </p>
            </div>
          </ScrollReveal>

          {/* Stats grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              // Localize labels depending on language
              let localizedLabel = stat.label;
              if (lang === "en") {
                if (stat.label === "البيانات الصحفية المنشورة") localizedLabel = "Published Press Releases";
                else if (stat.label === "منشورات شبكات التواصل") localizedLabel = "Social Media Publications";
                else if (stat.label === "تفاعل الجمهور والمتابعة") localizedLabel = "Public Engagement Rate";
                else if (stat.label === "رسائل المراجعين والردود") localizedLabel = "Citizen Inquiries Managed";
              }

              return (
                <ScrollReveal key={idx} direction="fade-up" delay={idx * 60 + 100}>
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4 hover:shadow-lg transition-all card-hover h-full">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400">{localizedLabel}</span>
                      <div className="p-2.5 bg-burgundy-100 text-burgundy-850 rounded-xl border border-burgundy-200/50">
                        <DynamicIcon name={stat.iconName as IconName} size={16} />
                      </div>
                    </div>
                    <div className={`space-y-1 ${alignClass}`}>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                        <AnimatedCounter target={stat.value} />
                      </h3>
                      <span className="text-[11px] text-green-600 font-extrabold flex items-center gap-1">
                        <span>▲</span>
                        <span>{stat.change}</span>
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Patient Feedback Volume Over Time Chart */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 ${alignClass}`}>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <DynamicIcon name="TrendingUp" size={18} className="text-burgundy-800" />
                  <span>
                    {lang === "ar" ? "حجم تفاعل وآراء المراجعين عبر الزمن" : "Patient Feedback & Inquiry Volume Over Time"}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  {lang === "ar" 
                    ? "مخطط تفاعلي يحلل الرسائل والشكاوى والاستفسارات الواردة خلال الأيام السبعة الأخيرة"
                    : "Interactive visualization of incoming messages, inquiries, and complaints over the last 7 days"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-xl self-start sm:self-auto shadow-sm">
                <span className="w-2 h-2 rounded-full bg-burgundy-800 animate-pulse"></span>
                <span>
                  {lang === "ar" ? "تحديث حي ومزامنة فورية" : "Live Local Sync"}
                </span>
              </div>
            </div>

            <div className="h-80 w-full font-sans" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorInquiry" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.01}/>
                    </linearGradient>
                    <linearGradient id="colorComplaint" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.01}/>
                    </linearGradient>
                    <linearGradient id="colorThank" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.01}/>
                    </linearGradient>
                    <linearGradient id="colorSuggestion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94A3B8" 
                    fontSize={11}
                    fontWeight={600}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#94A3B8" 
                    fontSize={11}
                    fontWeight={600}
                    tickLine={false}
                    axisLine={false}
                    dx={-5}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "12px",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)",
                      fontSize: "11px",
                      fontWeight: "700",
                      fontFamily: "inherit"
                    }}
                    labelStyle={{ color: "#1E293B", fontWeight: "bold", marginBottom: "4px" }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{
                      fontSize: "11px",
                      fontWeight: "bold",
                      fontFamily: "inherit",
                      paddingBottom: "12px"
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={lang === "ar" ? "استفسارات" : "Inquiries"} 
                    stroke="#0EA5E9" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorInquiry)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey={lang === "ar" ? "شكاوى" : "Complaints"} 
                    stroke="#F43F5E" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorComplaint)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey={lang === "ar" ? "رسائل شكر" : "Appreciation"} 
                    stroke="#10B981" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorThank)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey={lang === "ar" ? "اقتراحات" : "Suggestions"} 
                    stroke="#F59E0B" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorSuggestion)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Recent published news and quick action */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <button
                  onClick={() => setActiveTab("press")}
                  className="px-4 py-2 bg-burgundy-800 hover:bg-burgundy-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer border border-burgundy-850/10"
                >
                  {t.writeNewPost}
                </button>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <DynamicIcon name="FileText" size={18} className="text-burgundy-800" />
                  <span>{t.currentPosts}</span>
                </h3>
              </div>

              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1 space-y-4">
                {news.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex justify-between items-start gap-4">
                    {item.isPublishedByStaff && (
                      <span className="shrink-0 px-2 py-0.5 bg-green-50 text-green-700 text-[9px] font-bold rounded-full border border-green-100">
                        {t.publishedByYou}
                      </span>
                    )}
                    <div className={`space-y-1.5 flex-1 ${alignClass}`}>
                      <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-bold rounded-full border border-slate-200">
                        {lang === "ar" ? item.category : (
                          item.category === "بيان صحفي" ? "Press Release" :
                          item.category === "حملة توعوية" ? "Campaign" :
                          item.category === "أخبار المستشفى" ? "Hospital News" : "Official Notice"
                        )}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.excerpt}</p>
                      <div className="text-[10px] text-slate-400 font-semibold">
                        {lang === "ar" ? `تاريخ النشر: ${item.date}` : `Published: ${item.date}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips & Location reminder */}
            <div className="lg:col-span-5 bg-gradient-to-br from-burgundy-950 to-burgundy-850 text-white rounded-2xl border border-burgundy-850/10 p-6 shadow-md flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className={`p-3 bg-white/10 text-white rounded-xl w-max ${lang === "ar" ? "ml-auto" : "mr-auto"}`}>
                  <DynamicIcon name="Megaphone" size={20} />
                </div>
                <h3 className={`text-base font-bold text-white ${alignClass}`}>{t.prGuidelinesTitle}</h3>
                <ul className={`space-y-3 text-xs text-slate-300/80 leading-relaxed list-disc p-4 ${alignClass}`}>
                  <li>{t.guideline1}</li>
                  <li>{t.guideline2}</li>
                  <li>{t.guideline3}</li>
                </ul>
              </div>

              <div className={`bg-white/5 border border-white/10 rounded-xl p-4 text-xs space-y-2 ${alignClass}`}>
                <p className="font-extrabold text-burgundy-400">{t.hqPermanent}</p>
                <p className="text-slate-300/80 leading-relaxed font-light">
                  {t.hqPermanentBody}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. AI PRESS RELEASE GENERATOR */}
      {activeTab === "press" && (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
            <div className={`space-y-1.5 pb-4 border-b border-slate-100 ${alignClass}`}>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <DynamicIcon name="Bot" size={20} className="text-burgundy-800" />
                <span>{t.pressTitle}</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {t.pressDesc}
              </p>
            </div>

            <form onSubmit={handleGeneratePressRelease} className="space-y-4">
              {/* Topic */}
              <div className={`space-y-1.5 ${alignClass}`}>
                <label className="text-xs font-bold text-slate-700">{t.topicLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={t.topicPlaceholder}
                  value={pressTopic}
                  onChange={(e) => setPressTopic(e.target.value)}
                  className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-burgundy-800 focus:bg-white font-bold text-slate-950 ${alignClass}`}
                />
              </div>

              {/* Key Points */}
              <div className={`space-y-1.5 ${alignClass}`}>
                <label className="text-xs font-bold text-slate-700">{t.pointsLabel}</label>
                <textarea
                  rows={4}
                  placeholder={t.pointsPlaceholder}
                  value={pressPoints}
                  onChange={(e) => setPressPoints(e.target.value)}
                  className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-burgundy-800 focus:bg-white font-semibold text-slate-950 ${alignClass}`}
                ></textarea>
              </div>

              {/* Tone Selection */}
              <div className={`space-y-1.5 ${alignClass}`}>
                <label className="text-xs font-bold text-slate-700">{t.toneLabel}</label>
                <select
                  value={pressTone}
                  onChange={(e) => setPressTone(e.target.value)}
                  className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-burgundy-800 focus:bg-white font-bold text-slate-950 ${alignClass}`}
                >
                  <option value="رسمية ومهنية رصينة">{t.toneOption1}</option>
                  <option value="حماسية مفعمة بالأمل والتطور">{t.toneOption2}</option>
                  <option value="توعوية بسيطة وقريبة للمواطن">{t.toneOption3}</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGeneratingPress}
                className="w-full py-3 bg-gradient-to-r from-burgundy-900 to-burgundy-800 hover:from-burgundy-750 hover:to-sky-650 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer text-xs border border-burgundy-850/20"
              >
                {isGeneratingPress ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{t.generating}</span>
                  </>
                ) : (
                  <>
                    <DynamicIcon name="Bot" size={15} />
                    <span>{t.generatePressBtn}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              {pressResult ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(pressResult, setCopiedPress)}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1 border border-slate-200 cursor-pointer"
                  >
                    <DynamicIcon name={copiedPress ? "Check" : "Copy"} size={13} className={copiedPress ? "text-green-600" : ""} />
                    <span>{copiedPress ? t.copiedText : t.copyText}</span>
                  </button>
                  
                  <button
                    onClick={handlePublishToPublic}
                    className="px-3 py-1.5 bg-burgundy-800 hover:bg-burgundy-700 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer border border-burgundy-850/15"
                  >
                    <DynamicIcon name="Send" size={13} />
                    <span>{t.publishToPublic}</span>
                  </button>
                </div>
              ) : (
                <div />
              )}
              <h4 className="text-sm font-bold text-slate-900">{t.draftTitle}</h4>
            </div>

            {publishedPress && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-850 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <DynamicIcon name="CheckCircle2" size={16} className="text-green-700 shrink-0" />
                <span>{t.publishSuccess}</span>
              </div>
            )}

            {pressResult ? (
              <div className={`bg-slate-50 border border-slate-150 rounded-xl p-6 min-h-96 max-h-[500px] overflow-y-auto text-slate-800 font-sans text-sm leading-relaxed whitespace-pre-wrap ${alignClass}`}>
                {pressResult}
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-2xl p-16 text-center space-y-4 text-slate-400">
                <div className="mx-auto w-12 h-12 bg-slate-50 text-burgundy-800 rounded-xl border border-slate-150 flex items-center justify-center animate-pulse">
                  <DynamicIcon name="FileText" size={22} />
                </div>
                <div className="space-y-1.5 max-w-sm mx-auto">
                  <h4 className="font-bold text-slate-700 text-sm">{t.draftEmptyTitle}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {t.draftEmptyDesc}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. AI SOCIAL MEDIA DRAFTER */}
      {activeTab === "social" && (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
            <div className={`space-y-1.5 pb-4 border-b border-slate-100 ${alignClass}`}>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <DynamicIcon name="Megaphone" size={20} className="text-burgundy-800" />
                <span>{t.socialTitle}</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {t.socialDesc}
              </p>
            </div>

            <form onSubmit={handleGenerateSocialPosts} className="space-y-4">
              {/* Source Text */}
              <div className={`space-y-1.5 ${alignClass}`}>
                <label className="text-xs font-bold text-slate-700">{t.sourceLabel}</label>
                <textarea
                  rows={6}
                  required
                  placeholder={t.sourcePlaceholder}
                  value={socialSource}
                  onChange={(e) => setSocialSource(e.target.value)}
                  className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-burgundy-800 focus:bg-white font-semibold text-slate-950 ${alignClass}`}
                ></textarea>
              </div>

              {/* Platform Filter */}
              <div className={`space-y-1.5 ${alignClass}`}>
                <label className="text-xs font-bold text-slate-700">{t.platformLabel}</label>
                <select
                  value={socialPlatform}
                  onChange={(e) => setSocialPlatform(e.target.value)}
                  className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-burgundy-800 focus:bg-white font-bold text-slate-950 ${alignClass}`}
                >
                  <option value="جميع المنصات الرئيسية (فيسبوك، إكس/تويتر، وواتساب)">{t.platformAll}</option>
                  <option value="منشور تفاعلي ومطول لمنصة فيسبوك">{t.platformFB}</option>
                  <option value="منشور مختصر ومكثف لمنصة إكس (تويتر)">{t.platformX}</option>
                  <option value="رسالة قصيرة وودية معبرة لقروبات الواتساب المجتمعية بكسلا">{t.platformWA}</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGeneratingSocial}
                className="w-full py-3 bg-gradient-to-r from-burgundy-900 to-burgundy-800 hover:from-burgundy-750 hover:to-sky-650 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer text-xs border border-burgundy-850/20"
              >
                {isGeneratingSocial ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{t.generating}</span>
                  </>
                ) : (
                  <>
                    <DynamicIcon name="Bot" size={15} />
                    <span>{t.generateSocialBtn}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              {socialResult ? (
                <button
                  onClick={() => copyToClipboard(socialResult, setCopiedSocial)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1 border border-slate-200 cursor-pointer"
                >
                  <DynamicIcon name={copiedSocial ? "Check" : "Copy"} size={13} className={copiedSocial ? "text-green-600" : ""} />
                  <span>{copiedSocial ? t.copiedText : t.copyAllSocial}</span>
                </button>
              ) : (
                <div />
              )}
              <h4 className="text-sm font-bold text-slate-900">{t.suggestedDrafts}</h4>
            </div>

            {socialResult ? (
              <div className={`bg-slate-50 border border-slate-150 rounded-xl p-6 min-h-96 max-h-[500px] overflow-y-auto text-slate-800 font-sans text-sm leading-relaxed whitespace-pre-wrap ${alignClass}`}>
                {socialResult}
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-2xl p-16 text-center space-y-4 text-slate-400">
                <div className="mx-auto w-12 h-12 bg-slate-50 text-burgundy-800 rounded-xl border border-slate-150 flex items-center justify-center animate-pulse">
                  <DynamicIcon name="Megaphone" size={22} />
                </div>
                <div className="space-y-1.5 max-w-sm mx-auto">
                  <h4 className="font-bold text-slate-700 text-sm">{t.socialEmptyTitle}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {t.socialEmptyDesc}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. PUBLIC INBOX & PATIENT PR ASSISTANT */}
      {activeTab === "inbox" && (
        <div className="space-y-6">
          {/* Header */}
          <div className={`space-y-1.5 ${alignClass}`}>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">{t.inboxTitle}</h2>
            <p className="text-xs text-slate-500 font-medium">
              {t.inboxDesc}
            </p>
          </div>

          {inboxSuccessMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-850 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-sm">
              <DynamicIcon name="CheckCircle2" size={16} className="text-green-700 shrink-0" />
              <span>{inboxSuccessMessage}</span>
            </div>
          )}

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* List Column */}
            <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4 max-h-[600px] overflow-y-auto">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[10px] bg-burgundy-100 text-burgundy-850 px-2.5 py-0.5 rounded-full border border-burgundy-200/50 font-bold">
                  {t.inboxLocationBadge}
                </span>
                <span>{t.messagesCount} ({feedbacks.length})</span>
              </h3>

              {/* Bulk Selection and Action Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-150 rounded-xl text-[11px] font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="select-all-resolved"
                    checked={
                      feedbacks.filter(f => f.status === "replied").length > 0 &&
                      feedbacks.filter(f => f.status === "replied").every(f => selectedBulkFeedbackIds.includes(f.id))
                    }
                    onChange={(e) => {
                      const resolvedIds = feedbacks.filter(f => f.status === "replied").map(f => f.id);
                      if (e.target.checked) {
                        setSelectedBulkFeedbackIds(prev => Array.from(new Set([...prev, ...resolvedIds])));
                      } else {
                        setSelectedBulkFeedbackIds(prev => prev.filter(id => !resolvedIds.includes(id)));
                      }
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-burgundy-800 focus:ring-burgundy-800 accent-burgundy-850 cursor-pointer"
                  />
                  <label htmlFor="select-all-resolved" className="cursor-pointer select-none">
                    {lang === "ar" ? "تحديد كل الرسائل المكتملة" : "Select All Resolved"}
                  </label>
                </div>

                {selectedBulkFeedbackIds.filter(id => feedbacks.some(f => f.id === id && f.status === "replied")).length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const resolvedSelectedIds = selectedBulkFeedbackIds.filter(id => 
                        feedbacks.some(fb => fb.id === id && fb.status === "replied")
                      );
                      if (resolvedSelectedIds.length === 0) return;
                      
                      const confirmed = window.confirm(
                        lang === "ar"
                          ? `هل أنت متأكد من حذف ${resolvedSelectedIds.length} من الرسائل المكتملة المحددة؟`
                          : `Are you sure you want to delete ${resolvedSelectedIds.length} selected resolved messages?`
                      );
                      if (confirmed) {
                        resolvedSelectedIds.forEach(id => onDeleteFeedback(id));
                        setSelectedBulkFeedbackIds(prev => prev.filter(id => !resolvedSelectedIds.includes(id)));
                        setInboxSuccessMessage(
                          lang === "ar"
                            ? `تم حذف ${resolvedSelectedIds.length} من الرسائل المكتملة بنجاح`
                            : `Successfully deleted ${resolvedSelectedIds.length} resolved messages`
                        );
                        setTimeout(() => setInboxSuccessMessage(""), 4000);
                        if (selectedFeedback && resolvedSelectedIds.includes(selectedFeedback.id)) {
                          setSelectedFeedback(null);
                        }
                      }
                    }}
                    className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[10px]"
                  >
                    <DynamicIcon name="Trash2" size={12} />
                    <span>
                      {lang === "ar" 
                        ? `حذف المحددة (${selectedBulkFeedbackIds.filter(id => feedbacks.some(f => f.id === id && f.status === "replied")).length})` 
                        : `Delete Selected (${selectedBulkFeedbackIds.filter(id => feedbacks.some(f => f.id === id && f.status === "replied")).length})`
                      }
                    </span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {feedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    onClick={() => setSelectedFeedback(fb)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex gap-3 items-start ${
                      selectedFeedback?.id === fb.id
                        ? "bg-burgundy-100/40 border-burgundy-900/80 shadow-sm"
                        : fb.status === "pending"
                        ? "bg-white border-slate-150 hover:border-slate-300"
                        : "bg-slate-50/50 border-slate-100 opacity-75"
                    }`}
                  >
                    {/* Item Checkbox */}
                    <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedBulkFeedbackIds.includes(fb.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBulkFeedbackIds(prev => [...prev, fb.id]);
                          } else {
                            setSelectedBulkFeedbackIds(prev => prev.filter(id => id !== fb.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-burgundy-800 focus:ring-burgundy-800 accent-burgundy-850 cursor-pointer"
                      />
                    </div>

                    {/* Card Content wrapper */}
                    <div className={`flex-1 space-y-3 ${alignClass}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          fb.status === "pending" ? "bg-amber-500 text-white animate-pulse" : "bg-green-600 text-white"
                        }`}>
                          {fb.status === "pending" ? t.statusPending : t.statusReplied}
                        </span>

                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          fb.type === "complaint" ? "bg-red-50 text-red-700 border border-red-100" :
                          fb.type === "inquiry" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                          fb.type === "thank" ? "bg-green-50 text-green-700 border border-green-100" :
                          "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {fb.type === "complaint" ? t.typeComplaint :
                           fb.type === "inquiry" ? t.typeInquiry :
                           fb.type === "thank" ? t.typeThank :
                           t.typeSuggestion}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-xs md:text-sm">{fb.subject}</h4>
                        <p className="text-[10px] text-slate-400 font-bold">{t.senderLabel} {fb.senderName}</p>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-semibold">{fb.message}</p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-2">
                        <span>{fb.date}</span>
                        <span dir="ltr">{t.phoneLabel} {fb.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Patient Reply Assistant Column */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
              {selectedFeedback ? (
                <div className="space-y-6">
                  {/* Sender Details Header */}
                  <div className={`p-4 bg-slate-50 rounded-2xl border border-slate-200/50 space-y-3 ${alignClass}`}>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => onDeleteFeedback(selectedFeedback.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-100 transition-colors cursor-pointer"
                        title={t.deleteMsgTooltip}
                      >
                        <DynamicIcon name="Trash2" size={14} />
                      </button>
                      <h4 className="font-black text-slate-950 text-sm md:text-base">{selectedFeedback.subject}</h4>
                    </div>

                    <div className={`grid grid-cols-2 gap-4 text-xs text-slate-500 font-bold ${alignClass}`}>
                      <p>{t.senderLabel} <span className="text-slate-950">{selectedFeedback.senderName}</span></p>
                      <p>{t.phoneLabel} <span className="text-slate-950" dir="ltr">{selectedFeedback.phone}</span></p>
                      <p>{t.emailLabel} <span className="text-slate-950">{selectedFeedback.email || "—"}</span></p>
                      <p>{t.dateLabel} <span className="text-slate-950">{selectedFeedback.date}</span></p>
                    </div>

                    <div className={`p-3 bg-white rounded-xl border border-slate-150 text-xs leading-relaxed text-slate-600 font-semibold ${alignClass}`}>
                      <p className="font-black text-burgundy-850 mb-1">{t.citizenMsgText}</p>
                      {selectedFeedback.message}
                    </div>
                  </div>

                  {/* Actions Area */}
                  {selectedFeedback.status === "pending" ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleGenerateReplySuggestion(selectedFeedback)}
                          disabled={isGeneratingReply}
                          className="px-4 py-2 bg-burgundy-800 hover:bg-burgundy-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer border border-burgundy-850/15"
                        >
                          {isGeneratingReply ? (
                            <>
                              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              <span>{t.generating}</span>
                            </>
                          ) : (
                            <>
                              <DynamicIcon name="Bot" size={13} />
                              <span>{t.aiSuggestReplyBtn}</span>
                            </>
                          )}
                        </button>
                        <span className="text-xs font-extrabold text-slate-700">{t.officialReplyAI}</span>
                      </div>

                      {/* Reply Textarea */}
                      <div className={`space-y-1.5 ${alignClass}`}>
                        <textarea
                          rows={8}
                          value={editedReply}
                          onChange={(e) => setEditedReply(e.target.value)}
                          placeholder={t.replyPlaceholder}
                          className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-burgundy-800 focus:bg-white text-slate-950 font-semibold leading-relaxed ${alignClass}`}
                        ></textarea>
                      </div>

                      <div className="flex pt-2 border-t border-slate-100 justify-end">
                        <button
                          onClick={() => handleApproveReply(selectedFeedback.id)}
                          disabled={!editedReply}
                          className="px-6 py-2.5 bg-green-700 hover:bg-green-600 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-green-800"
                        >
                          <DynamicIcon name="CheckCircle2" size={13} />
                          <span>{t.approveReplyBtn}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display Already Replied Details */
                    <div className="space-y-4">
                      <div className={`p-4 bg-green-50/50 border border-green-200 rounded-xl text-green-800 text-xs font-semibold space-y-2 ${alignClass}`}>
                        <h5 className="font-bold flex items-center gap-1.5">
                          <DynamicIcon name="CheckCircle2" size={15} className="text-green-700 shrink-0" />
                          <span>{t.repliedNoticeTitle}</span>
                        </h5>
                        <p className="text-[11px] text-green-700 leading-relaxed font-medium">
                          {t.repliedNoticeDesc}
                        </p>
                      </div>

                      <div className={`bg-slate-50 border border-slate-150 rounded-xl p-4 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap font-sans font-bold ${alignClass}`}>
                        {selectedFeedback.replyText}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border border-dashed border-slate-200 rounded-2xl p-20 text-center space-y-4 text-slate-400">
                  <div className="mx-auto w-16 h-16 bg-slate-50 text-burgundy-800 rounded-xl border border-slate-150 flex items-center justify-center animate-pulse">
                    <DynamicIcon name="MessageSquare" size={28} />
                  </div>
                  <div className="space-y-1.5 max-w-sm mx-auto">
                    <h4 className="font-bold text-slate-700 text-sm">{t.inboxEmptyTitle}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      {t.inboxEmptyDesc}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
