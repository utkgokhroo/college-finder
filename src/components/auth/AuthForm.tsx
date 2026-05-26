"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  AuthFieldErrors,
  getPasswordStrength,
  hasAuthErrors,
  validateAuthForm,
} from "@/lib/auth-validation";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";

interface AuthFormProps {
  mode: AuthMode;
  onSubmit: (data: AuthFormData) => Promise<void>;
}

export interface AuthFormData {
  name?: string;
  email: string;
  password: string;
  acceptedTerms?: boolean;
}

function AlertIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    </svg>
  );
}

function AuthLogo() {
  return (
    <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--sapphire)] text-white">
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14 3 9l9-5 9 5-9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12v4.5c0 .9 2.2 2.5 5 2.5s5-1.6 5-2.5V12" />
      </svg>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-[var(--cloud)]" />
      <span className="text-xs text-[var(--mist)]">{label}</span>
      <div className="h-px flex-1 bg-[var(--cloud)]" />
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete: string;
  placeholder: string;
  hint?: string;
}) {
  const [visible, setVisible] = useState(false);
  const inputId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-[var(--ink)]">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={cn(
            "h-10 w-full rounded-[var(--radius)] border bg-white px-3 pr-20 text-sm text-[var(--ink)]",
            "placeholder:text-[var(--mist)] transition-shadow duration-150",
            "focus:outline-none focus:ring-2 focus:ring-[var(--sapphire)] focus:border-[var(--sapphire)]",
            error ? "border-[var(--rose)] focus:ring-[var(--rose)]" : "border-[var(--cloud)] hover:border-[var(--mist)]"
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-[var(--radius-sm)] px-2 py-1 text-xs font-medium text-[var(--slate)] transition-colors hover:bg-[var(--snow)] hover:text-[var(--ink)]"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {(hint || error) && (
        <p className={cn("text-xs", error ? "text-[var(--rose)]" : "text-[var(--mist)]")}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const strength = getPasswordStrength(password);
  const activeBars = Math.max(1, Math.min(4, strength.score));

  if (!password) return null;

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-4 gap-1">
        {[0, 1, 2, 3].map((bar) => (
          <div
            key={bar}
            className={cn(
              "h-1 rounded-full",
              bar < activeBars ? strength.className : "bg-[var(--cloud)]"
            )}
          />
        ))}
      </div>
      <p className="text-xs text-[var(--mist)]">Password strength: {strength.label}</p>
    </div>
  );
}

function TermsCheckbox({
  checked,
  onChange,
  error,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-start gap-2 text-sm text-[var(--slate)]">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-[var(--cloud)] accent-[var(--sapphire)]"
        />
        <span>
          I agree to use this frontend demo with mock account storage.
        </span>
      </label>
      {error && <p className="text-xs text-[var(--rose)]">{error}</p>}
    </div>
  );
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const isLogin = mode === "login";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});

  const copy = useMemo(
    () =>
      isLogin
        ? {
            title: "Welcome back",
            subtitle: "Log in to access saved colleges and comparisons.",
            button: "Log in",
            swapText: "New to CollegeFinder?",
            swapHref: "/signup",
            swapLabel: "Create an account",
          }
        : {
            title: "Create your account",
            subtitle: "Save colleges, compare shortlists, and keep your search organized.",
            button: "Create account",
            swapText: "Already have an account?",
            swapHref: "/login",
            swapLabel: "Log in",
          },
    [isLogin]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const errors = validateAuthForm({
      mode,
      name,
      email,
      password,
      confirmPassword,
      acceptedTerms,
    });

    setFieldErrors(errors);
    if (hasAuthErrors(errors)) return;

    try {
      setLoading(true);
      await onSubmit({
        name: name.trim() || undefined,
        email: email.trim().toLowerCase(),
        password,
        acceptedTerms,
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail("student@example.com");
    setPassword("College123");
    setFieldErrors({});
    setFormError("");
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-[var(--radius-xl)] border border-[var(--cloud)] bg-white p-6 shadow-[var(--shadow)] sm:p-8">
        <div className="mb-6 text-center">
          <AuthLogo />
          <h1 className="text-xl font-bold text-[var(--navy)]">{copy.title}</h1>
          <p className="mt-1 text-sm text-[var(--mist)]">{copy.subtitle}</p>
        </div>

        {formError && (
          <div className="mb-4 flex items-start gap-2.5 rounded-[var(--radius)] bg-[var(--rose-light)] px-3.5 py-3 text-sm text-[var(--rose)]">
            <AlertIcon />
            <span>{formError}</span>
          </div>
        )}

        {isLogin && (
          <div className="mb-4 rounded-[var(--radius)] border border-[var(--sapphire-light)] bg-[var(--sapphire-light)]/50 p-3 text-sm text-[var(--sapphire-dark)]">
            <p className="font-medium">Demo account</p>
            <p className="mt-1 text-xs">student@example.com / College123</p>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="mt-2 text-xs font-semibold text-[var(--sapphire)] hover:underline"
            >
              Fill demo credentials
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {!isLogin && (
            <Input
              label="Full name"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              error={fieldErrors.name}
            />
          )}

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            error={fieldErrors.email}
          />

          <PasswordInput
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete={isLogin ? "current-password" : "new-password"}
            placeholder={isLogin ? "Enter your password" : "At least 6 characters"}
            error={fieldErrors.password}
            hint={!isLogin ? "Use at least one letter and one number." : undefined}
          />

          {!isLogin && (
            <>
              <PasswordStrength password={password} />
              <PasswordInput
                label="Confirm password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                error={fieldErrors.confirmPassword}
              />
              <TermsCheckbox
                checked={acceptedTerms}
                onChange={setAcceptedTerms}
                error={fieldErrors.acceptedTerms}
              />
            </>
          )}

          <Button type="submit" fullWidth isLoading={loading} className="mt-2">
            {copy.button}
          </Button>
        </form>

        <div className="my-6">
          <Divider label="or" />
        </div>

        <p className="text-center text-sm text-[var(--mist)]">
          {copy.swapText}{" "}
          <Link href={copy.swapHref} className="font-medium text-[var(--sapphire)] hover:underline">
            {copy.swapLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
