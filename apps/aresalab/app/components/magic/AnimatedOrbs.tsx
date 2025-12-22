"use client";

import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

interface AnimatedOrbsProps {
  className?: string;
  count?: number;
  colors?: string[];
}

export function AnimatedOrbs({
  className,
  count = 3,
  colors = [
    "rgba(139, 92, 246, 0.3)",
    "rgba(59, 130, 246, 0.3)",
    "rgba(236, 72, 153, 0.3)",
  ],
}: AnimatedOrbsProps) {
  const orbs = Array.from({ length: count }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    size: Math.random() * 200 + 150,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 20,
  }));

  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.color,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

