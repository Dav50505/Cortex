"use client";

import { cn } from "../../lib/utils";

interface MeshGradientProps {
  className?: string;
  colors?: string[];
}

export function MeshGradient({
  className,
  colors = [
    "rgba(120, 119, 198, 0.3)",
    "rgba(255, 119, 198, 0.2)",
    "rgba(120, 219, 255, 0.2)",
  ],
}: MeshGradientProps) {
  return (
    <div
      className={cn("absolute inset-0 -z-10", className)}
      style={{
        background: `
          radial-gradient(at 0% 0%, ${colors[0]} 0px, transparent 50%),
          radial-gradient(at 100% 0%, ${colors[1]} 0px, transparent 50%),
          radial-gradient(at 100% 100%, ${colors[2]} 0px, transparent 50%),
          radial-gradient(at 0% 100%, ${colors[0]} 0px, transparent 50%)
        `,
      }}
    />
  );
}

