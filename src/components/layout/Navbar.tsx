"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useCompareStore } from "@/store/useCompareStore";

function CollegesIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14 3 9l9-5 9 5-9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 12v4.5c0 .9 2.2 2.5 5 2.5s5-1.6 5-2.5V12" />
    </svg>
  );
}

function CompareIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10M7 20h10M6 8l-3 6h6L6 8zm12 0-3 6h6l-3-6zM12 4v16" />
    </svg>
  );
}

function SavedIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}

const NAV_LINKS = [
  { href: "/colleges", label: "Colleges", icon: <CollegesIcon /> },
  { href: "/compare", label: "Compare", icon: <CompareIcon /> },
  { href: "/saved", label: "Saved", icon: <SavedIcon /> },
];

export function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn, user, logout } = useAuthStore();
  const compareCount = useCompareStore((state) => state.selectedIds.length);

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--cloud)] bg-white/90 backdrop-blur-md" aria-label="Primary navigation">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
        <Link
          href="/colleges"
          className="flex min-w-0 items-center gap-2 text-lg font-bold tracking-tight text-[var(--navy)] transition-colors hover:text-[var(--sapphire)]"
          aria-label="CollegeFinder home"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--sapphire)] text-sm text-white">
            C
          </span>
          <span className="hidden truncate sm:block">CollegeFinder</span>
        </Link>

        <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto">
          {NAV_LINKS.map(({ href, label, icon }) => {
            const isActive = pathname.startsWith(href);
            const isCompare = href === "/compare";

            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex h-9 shrink-0 items-center gap-1.5 rounded-[var(--radius)] px-2.5 text-sm font-medium transition-colors sm:px-3",
                  isActive
                    ? "bg-[var(--sapphire-light)] text-[var(--sapphire-dark)]"
                    : "text-[var(--slate)] hover:bg-[var(--snow)] hover:text-[var(--ink)]"
                )}
              >
                {icon}
                <span className="hidden sm:block">{label}</span>
                {isCompare && compareCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--sapphire)] px-1 text-[10px] font-bold text-white">
                    {compareCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {isLoggedIn ? (
            <>
              <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-[var(--sapphire-light)] text-xs font-semibold text-[var(--sapphire-dark)] sm:flex">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="hidden max-w-[120px] truncate text-sm text-[var(--slate)] lg:block">
                {user?.name}
              </span>
              <Button variant="ghost" size="sm" onClick={logout} aria-label="Log out">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/signup" className="hidden sm:block">
                <Button variant="primary" size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
