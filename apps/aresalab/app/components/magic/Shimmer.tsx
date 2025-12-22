"use client";

import { cn } from "../../lib/utils";
import { ReactNode } from "react";

interface ShimmerProps {
  children: ReactNode;
  className?: string;
}

export function Shimmer({ children, className }: ShimmerProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {children}
    </div>
  );
}

