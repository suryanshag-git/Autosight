import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none";
  
  const variants = {
    default: "border-transparent bg-[#6366f1]/10 text-indigo-300 border border-[#6366f1]/20",
    secondary: "border-transparent bg-[#1f2937] text-slate-100 border border-[#2d3748]",
    outline: "text-slate-400 border border-slate-700",
    success: "border-transparent bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    warning: "border-transparent bg-amber-500/10 text-amber-400 border border-amber-500/20",
    destructive: "border-transparent bg-red-500/10 text-red-400 border border-red-500/20",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className || ""}`} {...props} />
  );
}
