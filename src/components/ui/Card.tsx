import { cn } from "@/lib/utils";

export interface CardProps {
  children:   React.ReactNode;
  className?: string;
  onClick?:   () => void;
  /** Lift shadow on hover */
  hoverable?: boolean;
  /** Remove all padding (for images/tables that bleed edge-to-edge) */
  flush?: boolean;
  /** Highlight with a left accent border */
  accent?: boolean;
}

export function Card({ children, className, onClick, hoverable, flush, accent }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--cloud)] bg-white",
        "shadow-[var(--shadow-sm)]",
        hoverable && "cursor-pointer transition-all duration-200 hover:shadow-[var(--shadow)] hover:-translate-y-0.5",
        flush   ? "" : "p-5",
        accent  && "border-l-[3px] border-l-[var(--sapphire)]",
        onClick && "select-none",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Convenience sub-components ──────────────────────────────────────────────
Card.Header = function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
};

Card.Title = function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-base font-semibold text-[var(--ink)]", className)}>{children}</h3>;
};

Card.Body = function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-sm text-[var(--slate)]", className)}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mt-4 flex items-center gap-2 border-t border-[var(--cloud)] pt-4", className)}>
      {children}
    </div>
  );
};
