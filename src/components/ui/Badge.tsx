import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "blue" | "green" | "amber" | "red" | "navy";
export type BadgeSize    = "sm" | "md";

export interface BadgeProps {
  children:   React.ReactNode;
  variant?:   BadgeVariant;
  size?:      BadgeSize;
  dot?:       boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-600",
  blue:    "bg-blue-50   text-blue-700",
  green:   "bg-emerald-50 text-emerald-700",
  amber:   "bg-amber-50  text-amber-700",
  red:     "bg-rose-50   text-rose-700",
  navy:    "bg-slate-900 text-white",
};

const dotStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-400",
  blue:    "bg-blue-500",
  green:   "bg-emerald-500",
  amber:   "bg-amber-500",
  red:     "bg-rose-500",
  navy:    "bg-white",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2   py-0.5 text-xs",
  md: "px-2.5 py-1   text-xs",
};

export function Badge({
  children,
  variant = "default",
  size = "sm",
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotStyles[variant])} />
      )}
      {children}
    </span>
  );
}
