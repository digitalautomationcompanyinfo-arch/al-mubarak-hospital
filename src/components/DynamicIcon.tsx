import React from "react";
import {
  HeartPulse,
  Baby,
  Activity,
  Sparkles,
  Flame,
  Megaphone,
  FileText,
  MessageSquare,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  Compass,
  LayoutDashboard,
  FileSpreadsheet,
  Bot,
  Send,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Copy,
  Check,
  Sparkle,
  LogOut,
  LogIn,
  Menu,
  X,
  Building,
  Globe,
  ArrowRight,
  AlertCircle,
  FileSignature,
  Droplet,
  Sun,
  Heart,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  LineChart
} from "lucide-react";

const iconMap = {
  HeartPulse,
  Baby,
  Activity,
  Sparkles,
  Flame,
  Megaphone,
  FileText,
  MessageSquare,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  Compass,
  LayoutDashboard,
  FileSpreadsheet,
  Bot,
  Send,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Copy,
  Check,
  Sparkle,
  LogOut,
  LogIn,
  Menu,
  X,
  Building,
  Globe,
  ArrowRight,
  AlertCircle,
  FileSignature,
  Droplet,
  Sun,
  Heart,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  LineChart
};

export type IconName = keyof typeof iconMap;

interface DynamicIconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export default function DynamicIcon({ name, className = "", size = 24 }: DynamicIconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    return <AlertCircle className={className} size={size} />;
  }
  return <IconComponent className={className} size={size} />;
}
