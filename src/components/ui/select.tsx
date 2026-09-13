import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "flex h-11 w-full appearance-none rounded-xl border bg-card px-4 py-2 pe-10 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all cursor-pointer",
            error
              ? "border-rose-500 focus-visible:ring-rose-500/30"
              : "border-border hover:border-border/80 focus-visible:ring-amber-500/30 focus-visible:border-amber-500",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";
