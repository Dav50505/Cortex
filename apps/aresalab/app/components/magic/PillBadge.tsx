"use client";

import { cn } from "../../lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PillBadgeProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "outline" | "glow";
  size?: "sm" | "md" | "lg";
}

export function PillBadge({
  children,
  className,
  variant = "default",
  size = "md",
}: PillBadgeProps) {
  const baseStyles = "inline-flex items-center font-semibold rounded-full transition-all duration-300";
  
  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  const variants = {
    default: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700",
    gradient: "bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white shadow-lg shadow-purple-500/30",
    outline: "bg-transparent border-2 border-purple-500/50 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10",
    glow: "bg-purple-500/20 dark:bg-purple-500/30 text-purple-600 dark:text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-500/20",
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={cn(baseStyles, sizeStyles[size], variants[variant], className)}
    >
      {children}
    </motion.span>
  );
}

