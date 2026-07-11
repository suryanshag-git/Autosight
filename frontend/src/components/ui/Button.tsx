import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer";
  
  const variants = {
    primary: "bg-[#6366f1] text-white hover:bg-[#4f46e5] shadow-lg shadow-indigo-500/10",
    secondary: "bg-[#1f2937] text-slate-100 hover:bg-[#2d3748] border border-[#2d3748]",
    destructive: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
    ghost: "text-slate-400 hover:bg-[#1f2937] hover:text-white",
  };

  const sizes = {
    sm: "h-9 px-3 text-xs rounded-lg",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-11 px-6 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`}
      {...props}
    />
  );
}
