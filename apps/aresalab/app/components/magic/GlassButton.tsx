"use client";

import { cn } from "../../lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  href?: string;
  onClick?: () => void;
  [key: string]: any;
}

export function GlassButton({
  children,
  className,
  variant = "primary",
  href,
  onClick,
  ...props
}: GlassButtonProps) {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 relative overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105",
    secondary: "bg-white/10 dark:bg-gray-800/30 backdrop-blur-md border border-white/20 dark:border-gray-700/50 text-gray-900 dark:text-gray-100 hover:bg-white/20 dark:hover:bg-gray-800/50 hover:scale-105",
    outline: "bg-transparent border-2 border-purple-500/50 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 hover:border-purple-500 hover:scale-105",
  };

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "primary" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
      )}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(baseStyles, variants[variant], className)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={cn(baseStyles, variants[variant], className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {content}
    </motion.button>
  );
}

