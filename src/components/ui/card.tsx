import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "modern" | "glow" | "subtle";
  padding?: "none" | "sm" | "md" | "lg";
}

/** Surface container card primitive supporting modern, glow, and subtle border stylings. */
export const Card: React.FC<CardProps> = ({
  className,
  variant = "modern",
  padding = "md",
  children,
  ...props
}) => {
  const variantStyles = {
    modern: "modern-card",
    glow: "glass-glow-card",
    subtle: "bg-white rounded-3xl border border-neutral-200/80 shadow-xs",
  };

  const paddingStyles = {
    none: "p-0",
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-4 sm:p-6 lg:p-8",
  };

  return (
    <div className={cn(variantStyles[variant], paddingStyles[padding], className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h3 className={cn("font-black leading-none tracking-tight text-neutral-900 text-base sm:text-lg", className)} {...props} />
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => (
  <p className={cn("text-xs text-neutral-500 font-medium", className)} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div className={cn("pt-0", className)} {...props} />
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div className={cn("flex items-center pt-4 border-t border-neutral-100", className)} {...props} />
);
