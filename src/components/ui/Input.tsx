import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:      string;
  hint?:       string;
  error?:      string;
  leftIcon?:   React.ReactNode;
  rightIcon?:  React.ReactNode;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftIcon, rightIcon, wrapperClassName, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--ink)]">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--mist)]">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "h-10 w-full rounded-[var(--radius)] border bg-white px-3 text-sm text-[var(--ink)]",
              "placeholder:text-[var(--mist)]",
              "transition-shadow duration-150",
              "focus:outline-none focus:ring-2 focus:ring-[var(--sapphire)] focus:ring-offset-0 focus:border-[var(--sapphire)]",
              "disabled:opacity-50 disabled:bg-[var(--snow)]",
              error
                ? "border-[var(--rose)] focus:ring-[var(--rose)]"
                : "border-[var(--cloud)] hover:border-[var(--mist)]",
              leftIcon  ? "pl-9" : "",
              rightIcon ? "pr-9" : "",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--mist)]">
              {rightIcon}
            </span>
          )}
        </div>
        {(hint || error) && (
          <p className={cn("text-xs", error ? "text-[var(--rose)]" : "text-[var(--mist)]")}>
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
