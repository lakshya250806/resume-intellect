import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "purple" | "fuchsia" | "emerald";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500",
        {
          "border-transparent bg-purple-600 text-white shadow": variant === "default",
          "border-transparent bg-slate-800 text-slate-100": variant === "secondary",
          "border-transparent bg-red-500/10 border-red-500/20 text-red-400": variant === "destructive",
          "border-white/10 bg-white/5 text-slate-300": variant === "outline",
          "border-purple-500/20 bg-purple-500/10 text-purple-300": variant === "purple",
          "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300": variant === "fuchsia",
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-400": variant === "emerald",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
