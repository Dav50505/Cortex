"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

interface AnimatedNumberProps {
  value: number | string;
  className?: string;
  duration?: number;
  decimals?: number;
}

export function AnimatedNumber({
  value,
  className,
  duration = 2000,
  decimals = 0,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numValue = typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  const isAnimating = useRef(false);

  useEffect(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const startValue = displayValue;
    const endValue = numValue;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = startValue + (endValue - startValue) * easeOutQuart;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isAnimating.current = false;
      }
    };

    requestAnimationFrame(animate);
  }, [numValue, duration]);

  return (
    <span className={cn("tabular-nums", className)}>
      {displayValue.toFixed(decimals).toLocaleString()}
    </span>
  );
}

