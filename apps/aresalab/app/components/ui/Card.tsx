"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "../../lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    gradient?: boolean;
}

export function Card({ className, children, gradient = true, ...props }: CardProps) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
                "relative overflow-hidden rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-lg hover:border-border/80",
                "backdrop-blur-sm",
                className
            )}
            {...props}
        >
            {gradient && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent dark:from-white/5 pointer-events-none" />
            )}
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}
