"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { ArrowRight, Bot } from "lucide-react";
import { Badge } from "../ui/Badge";
import Link from "next/link";

export function Hero() {
    const words = "Collaborative Autonomous Research Systems".split(" ");

    return (
        <div className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 pt-20 pb-16 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-100 via-background to-background dark:from-neutral-900/50 dark:via-background dark:to-background opacity-80" />

            {/* Decorative blobs */}
            <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-pulse" />
            <div className="absolute top-[30%] right-[20%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDelay: "2s" }} />

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-10 relative z-10"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <Badge variant="outline" className="py-1.5 px-4 bg-background/50 backdrop-blur-md border-border text-sm shadow-sm rounded-full">
                        <Bot className="w-3.5 h-3.5 mr-2 text-primary" />
                        <span className="text-muted-foreground font-medium">Introducing Cortex Protocol 2.0</span>
                    </Badge>
                </motion.div>

                <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-foreground leading-[1.1]">
                    <span className="inline-block bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent pb-4">
                        CORTEX
                    </span>
                    <div className="text-2xl md:text-4xl font-light text-muted-foreground mt-2 flex flex-wrap justify-center gap-x-3 leading-normal">
                        {words.map((word, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                                className="inline-block"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </div>
                </h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed text-center"
                >
                    Engineering the <span className="text-foreground font-medium">"Hive Mind"</span> — swarms of specialized AI agents collaborating to accelerate scientific discovery.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 pt-8"
                >
                    <Link href="#research">
                        <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                            Start Research <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base backdrop-blur-sm bg-background/50 hover:bg-background/80 border-border">
                            View Dashboard
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
