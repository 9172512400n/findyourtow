import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children: ReactNode;
};

const variants = {
  primary: "bg-blue-500 text-white shadow-[0_18px_45px_rgba(59,130,246,0.35)] hover:bg-blue-400",
  secondary: "border border-white/12 bg-white/[0.07] text-white hover:bg-white/[0.12]",
  ghost: "bg-transparent text-white/74 hover:bg-white/[0.08] hover:text-white",
  danger: "bg-rose-500 text-white hover:bg-rose-400",
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
