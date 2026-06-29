import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "card" | "circle" | "rect";
}

export default function Skeleton({ className = "", variant = "text" }: SkeletonProps) {
  const baseClasses = "animate-pulse bg-slate-200 rounded-lg";

  if (variant === "circle") {
    return <div className={`${baseClasses} rounded-full ${className}`} />;
  }

  if (variant === "card") {
    return (
      <div className={`${baseClasses} rounded-2xl p-4 space-y-3 ${className}`}>
        <div className="h-4 bg-slate-300 rounded-lg w-3/4" />
        <div className="h-3 bg-slate-300 rounded-lg w-full" />
        <div className="h-3 bg-slate-300 rounded-lg w-5/6" />
      </div>
    );
  }

  return <div className={`${baseClasses} h-4 ${className}`} />;
}

/** Pre-built skeleton layouts for common loading states */
export function FormSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton variant="text" className="w-1/3 h-5" />
      <Skeleton variant="text" className="w-full h-10" />
      <Skeleton variant="text" className="w-full h-10" />
      <Skeleton variant="text" className="w-2/3 h-10" />
      <Skeleton variant="text" className="w-full h-24" />
    </div>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} variant="card" className="h-56" />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton variant="text" className="w-full h-8" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="text" className="w-full h-6" />
      ))}
    </div>
  );
}
