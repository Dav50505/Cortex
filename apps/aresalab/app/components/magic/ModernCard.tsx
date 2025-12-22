"use client";

import { cn } from "../../lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "glass" | "gradient";
  hover?: boolean;
}

export function ModernCard({
  children,
  className,
  variant = "default",
  hover = true,
}: ModernCardProps) {
  const baseStyles = "rounded-2xl p-6 transition-all duration-300";
  
  const variants = {
    default: "bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg",
    elevated: "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-2xl hover:shadow-3xl",
    glass: "bg-white/20 dark:bg-gray-800/20 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 shadow-xl",
    gradient: "bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl",
  };

  const hoverStyles = hover ? "hover:scale-[1.02] hover:shadow-2xl" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(baseStyles, variants[variant], hoverStyles, className)}
    >
      {children}
    </motion.div>
  );
}

