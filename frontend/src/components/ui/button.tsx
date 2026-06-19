import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "glow";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-glow-purple hover:opacity-95":
              variant === "default",
            "bg-red-600 text-white hover:bg-red-500 shadow-sm":
              variant === "destructive",
            "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white":
              variant === "outline",
            "bg-slate-800 text-slate-100 hover:bg-slate-700":
              variant === "secondary",
            "text-slate-400 hover:bg-white/5 hover:text-white":
              variant === "ghost",
            "text-purple-400 underline-offset-4 hover:underline":
              variant === "link",
            "relative bg-slate-900 border border-purple-500/30 text-purple-300 hover:text-white shadow-glow-purple hover:border-purple-400/50 hover:bg-purple-500/5":
              variant === "glow",
          },
          {
            "h-10 px-4 py-2": size === "default",
            "h-8 rounded-lg px-3 text-xs": size === "sm",
            "h-12 px-8 py-3 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
