import React, { useEffect, useRef, useState } from "react";

type RevealDirection = "fade-up" | "fade-left" | "fade-right" | "scale-up" | "fade-down";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  direction = "fade-up",
  delay = 0,
  duration = 700,
  className = "",
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  const getInitialStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      opacity: 0,
      transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    };

    switch (direction) {
      case "fade-up":
        return { ...base, transform: "translateY(40px)" };
      case "fade-down":
        return { ...base, transform: "translateY(-40px)" };
      case "fade-left":
        return { ...base, transform: "translateX(-40px)" };
      case "fade-right":
        return { ...base, transform: "translateX(40px)" };
      case "scale-up":
        return { ...base, transform: "scale(0.92)" };
      default:
        return base;
    }
  };

  const getVisibleStyle = (): React.CSSProperties => ({
    opacity: 1,
    transform: "translateY(0) translateX(0) scale(1)",
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
  });

  return (
    <div
      ref={ref}
      className={className}
      style={isVisible ? getVisibleStyle() : getInitialStyle()}
    >
      {children}
    </div>
  );
}
