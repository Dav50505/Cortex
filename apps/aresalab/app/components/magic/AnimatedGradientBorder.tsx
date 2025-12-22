"use client";

import { cn } from "../../lib/utils";
import { ReactNode } from "react";

interface AnimatedGradientBorderProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  borderColor?: string;
  duration?: number;
}

export function AnimatedGradientBorder({
  children,
  className,
  borderWidth = 2,
  borderColor = "from-purple-500 via-pink-500 to-blue-500",
  duration = 3,
}: AnimatedGradientBorderProps) {
  return (
    <div className={cn("relative p-[2px] rounded-xl", className)}>
      <div
        className={cn(
          "absolute inset-0 rounded-xl opacity-75",
          `bg-gradient-to-r ${borderColor}`
        )}
        style={{
          animation: `spin ${duration}s linear infinite`,
        }}
      />
      <div className="relative bg-background rounded-xl">{children}</div>
    </div>
  );
}

