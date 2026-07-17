import React, { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  target: string; // e.g. "15+" or "24/7" or "١٢٠"
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  target,
  duration = 2000,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(target);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateValue();
          observer.unobserve(element);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateValue = () => {
    // Extract numeric part from the target string
    // Supports Arabic numerals (٠-٩) and Western numerals (0-9)
    const arabicToWestern = (s: string) =>
      s.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

    const westernTarget = arabicToWestern(target);
    const numericMatch = westernTarget.match(/[\d]+/);

    if (!numericMatch) {
      // No numeric part found, just display as-is
      setDisplay(target);
      return;
    }

    const numericValue = parseInt(numericMatch[0], 10);
    const prefix = target.substring(0, target.indexOf(numericMatch[0]) >= 0 ? target.indexOf(numericMatch[0].charAt(0)) : 0);
    
    // Find where the number starts and ends in the original string
    const westernStr = arabicToWestern(target);
    const matchIndex = westernStr.indexOf(numericMatch[0]);
    const originalPrefix = target.substring(0, matchIndex);
    const originalSuffix = target.substring(matchIndex + numericMatch[0].length);

    // Check if target uses Arabic numerals
    const usesArabicNumerals = /[٠-٩]/.test(target);
    const westernToArabic = (n: number): string => {
      return String(n).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
    };

    if (numericValue === 0) {
      setDisplay(target);
      return;
    }

    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(eased * numericValue);

      const displayNum = usesArabicNumerals
        ? westernToArabic(currentValue)
        : String(currentValue);

      setDisplay(`${originalPrefix}${displayNum}${originalSuffix}`);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
