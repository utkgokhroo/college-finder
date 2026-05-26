export interface AuthValidationInput {
  mode: "login" | "signup";
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  acceptedTerms?: boolean;
}

export type AuthFieldErrors = Partial<Record<"name" | "email" | "password" | "confirmPassword" | "acceptedTerms", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string) {
  if (!email.trim()) return "Email is required.";
  if (!emailPattern.test(email.trim())) return "Enter a valid email address.";
  return "";
}

export function validatePassword(password: string, mode: "login" | "signup") {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (mode === "signup" && !/[A-Za-z]/.test(password)) return "Use at least one letter.";
  if (mode === "signup" && !/\d/.test(password)) return "Use at least one number.";
  return "";
}

export function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { label: "Weak", score, className: "bg-[var(--rose)]" };
  if (score <= 3) return { label: "Good", score, className: "bg-[var(--amber)]" };
  return { label: "Strong", score, className: "bg-[var(--emerald)]" };
}

export function validateAuthForm(input: AuthValidationInput) {
  const errors: AuthFieldErrors = {};
  const isSignup = input.mode === "signup";

  if (isSignup && !input.name?.trim()) {
    errors.name = "Full name is required.";
  } else if (isSignup && input.name && input.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  const emailError = validateEmail(input.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(input.password, input.mode);
  if (passwordError) errors.password = passwordError;

  if (isSignup && input.confirmPassword !== input.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (isSignup && !input.acceptedTerms) {
    errors.acceptedTerms = "Please accept the terms to continue.";
  }

  return errors;
}

export function hasAuthErrors(errors: AuthFieldErrors) {
  return Object.values(errors).some(Boolean);
}
