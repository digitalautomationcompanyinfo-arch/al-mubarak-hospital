export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: "بيان صحفي" | "حملة توعوية" | "أخبار المستشفى" | "إعلان رسمي";
  image?: string;
  isPublishedByStaff?: boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  iconName: string;
  features: string[];
}

export interface PatientFeedback {
  id: string;
  senderName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "pending" | "replied";
  replyText?: string;
  type: "complaint" | "inquiry" | "thank" | "suggestion";
}

export interface MediaStat {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  iconName: string;
}export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  isVisiting: boolean;
  image: string;
  availableDays: string[];
}
