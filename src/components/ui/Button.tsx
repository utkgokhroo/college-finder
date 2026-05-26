import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize    = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  isLoading?: boolean;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:   "bg-blue-600 text-white border-transparent hover:bg-blue-700 active:scale-[0.98]",
  secondary: "bg-white text-slate-800 border-slate-200 hover:bg-slate-50 active:scale-[0.98]",
  ghost:     "bg-transparent text-slate-600 border-transparent hover:bg-slate-100 active:scale-[0.98]",
  danger:    "bg-rose-600 text-white border-transparent hover:bg-rose-700 active:scale-[0.98]",
  outline:   "bg-transparent text-blue-600 border-blue-600 hover:bg-blue-50 active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-7  px-2.5 text-xs  gap-1   rounded-md",
  sm: "h-8  px-3   text-sm  gap-1.5 rounded-md",
  md: "h-10 px-4   text-sm  gap-2   rounded-lg",
  lg: "h-12 px-6   text-base gap-2  rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center font-medium border transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none select-none",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  )
);
Button.displayName = "Button";
