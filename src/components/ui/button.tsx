import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "amber" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "xl" | "icon";
  fullWidth?: boolean;
  isLoading?: boolean;
}

/** Primary interactive button primitive supporting variants, sizes, loading spinners, and active states. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      type = "button",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold transition-all cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-offset-2";

    const variantStyles = {
      primary:
        "btn-3d-primary shadow-md active:translate-y-[1px]",
      amber:
        "btn-3d-gold shadow-md active:translate-y-[1px]",
      secondary:
        "btn-3d-secondary active:translate-y-[1px]",
      outline:
        "bg-card hover:bg-muted/60 border border-border text-foreground shadow-2xs hover:border-accent active:translate-y-[1px]",
      danger:
        "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 active:translate-y-[1px]",
      ghost:
        "hover:bg-muted/60 text-foreground active:translate-y-[1px]",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs rounded-xl min-h-[36px]",
      md: "px-5 py-2.5 text-xs sm:text-sm rounded-xl min-h-[44px]",
      lg: "px-8 py-3.5 text-sm sm:text-base rounded-2xl min-h-[48px]",
      xl: "px-8 py-4 text-base font-black rounded-2xl min-h-[54px]",
      icon: "p-2 rounded-xl min-w-[44px] min-h-[44px]",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth ? "w-full" : "",
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 aria-hidden="true" className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
