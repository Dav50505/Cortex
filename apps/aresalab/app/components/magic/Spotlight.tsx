"use client";

import { cn } from "../../lib/utils";
import { ReactNode } from "react";

interface SpotlightProps {
  children: ReactNode;
  className?: string;
  size?: number;
  color?: string;
}

export function Spotlight({
  children,
  className,
  size = 600,
  color = "rgba(120, 119, 198, 0.3)",
}: SpotlightProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="pointer-events-none absolute -z-10 h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(${size}px circle at var(--mouse-x) var(--mouse-y), ${color}, transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

