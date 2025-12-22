"use client";

import { cn } from "../../lib/utils";
import { Card } from "../ui/Card";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[20rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
    gradient = "from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900",
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
    gradient?: string;
}) => {
    return (
        <Card
            className={cn(
                "row-span-1 group/bento transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4",
                className
            )}
        >
            {header}
            <div className="group-hover/bento:translate-x-2 transition duration-200">
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    {icon}
                </div>
                <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
                    {title}
                </div>
                <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
                    {description}
                </div>
            </div>

            {/* Decorative gradient blob */}
            <div className={cn(
                "absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity group-hover/bento:opacity-40 bg-gradient-to-br",
                gradient
            )} />
        </Card>
    );
};
