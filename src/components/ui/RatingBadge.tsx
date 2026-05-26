import { cn } from "@/lib/utils";

export type RatingTier = "elite" | "top" | "good" | "standard";

export interface RatingBadgeProps {
  ranking:   number;
  className?: string;
  size?:     "sm" | "md" | "lg";
}

function getTier(ranking: number): RatingTier {
  if (ranking <= 10)  return "elite";
  if (ranking <= 25)  return "top";
  if (ranking <= 50)  return "good";
  return "standard";
}

const tierConfig: Record<RatingTier, { label: string; ring: string; bg: string; text: string }> = {
  elite:    { label: "Elite",    ring: "ring-[var(--amber)]",    bg: "bg-[var(--amber-light)]",    text: "text-[var(--amber)]"    },
  top:      { label: "Top 25",   ring: "ring-[var(--sapphire)]", bg: "bg-[var(--sapphire-light)]", text: "text-[var(--sapphire-dark)]" },
  good:     { label: "Top 50",   ring: "ring-[var(--emerald)]",  bg: "bg-[var(--emerald-light)]",  text: "text-[var(--emerald)]"  },
  standard: { label: "Ranked",   ring: "ring-[var(--cloud)]",    bg: "bg-[var(--snow)]",            text: "text-[var(--slate)]"   },
};

const sizeStyles = {
  sm: { outer: "h-9 w-9 ring-[1.5px]", rank: "text-sm font-bold leading-none", label: "hidden" },
  md: { outer: "h-12 w-12 ring-2",     rank: "text-base font-bold leading-none", label: "text-[10px] font-medium leading-none mt-0.5" },
  lg: { outer: "h-16 w-16 ring-2",     rank: "text-xl font-bold leading-none",   label: "text-xs font-medium leading-none mt-1" },
};

export function RatingBadge({ ranking, size = "md", className }: RatingBadgeProps) {
  const tier   = getTier(ranking);
  const config = tierConfig[tier];
  const sz     = sizeStyles[size];

  return (
    <div
      title={`Ranked #${ranking} nationally`}
      className={cn(
        "flex flex-col items-center justify-center rounded-full",
        "transition-transform duration-150 hover:scale-105",
        config.bg, config.ring, "ring-inset",
        sz.outer,
        className
      )}
    >
      <span className={cn(config.text, sz.rank)}>#{ranking}</span>
      {sz.label !== "hidden" && (
        <span className={cn(config.text, sz.label, "opacity-70")}>{config.label}</span>
      )}
    </div>
  );
}
