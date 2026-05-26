import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

interface AuthShellProps {
  children: React.ReactNode;
  mode: "login" | "signup";
}

const highlights = [
  "Save college shortlists",
  "Compare fees and placements",
  "Keep mock sessions locally",
];

export function AuthShell({ children, mode }: AuthShellProps) {
  const isLogin = mode === "login";

  return (
    <div className="grid min-h-[calc(100vh-8rem)] items-center gap-8 py-8 lg:grid-cols-[1fr_440px] lg:py-12">
      <section className="hidden max-w-2xl lg:block">
        <Badge variant="blue" dot>
          Frontend-only demo
        </Badge>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-[var(--navy)]">
          {isLogin ? "Pick up your college search where you left off." : "Create a simple student workspace."}
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--slate)]">
          This authentication flow is mocked on the client, so students can experience account creation,
          login, persistence, and validation without any backend setup.
        </p>

        <div className="mt-8 grid gap-3">
          {highlights.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--cloud)] bg-white px-4 py-3 shadow-[var(--shadow-sm)]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--emerald-light)] text-[var(--emerald)]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                </svg>
              </span>
              <span className="text-sm font-medium text-[var(--ink)]">{item}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-[var(--mist)]">
          Continue to{" "}
          <Link href="/colleges" className="font-medium text-[var(--sapphire)] hover:underline">
            browse colleges
          </Link>
          {" "}without signing in.
        </p>
      </section>

      <section className="mx-auto flex w-full justify-center">
        {children}
      </section>
    </div>
  );
}
