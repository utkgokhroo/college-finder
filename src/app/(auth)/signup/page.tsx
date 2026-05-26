"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthForm, AuthFormData } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default function SignupPage() {
  const { signup, isLoggedIn } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) router.replace("/colleges");
  }, [isLoggedIn, router]);

  const handleSubmit = async ({ name, email, password }: AuthFormData) => {
    await signup(name ?? "", email, password);
    router.push("/colleges");
  };

  return (
    <AuthShell mode="signup">
      <AuthForm mode="signup" onSubmit={handleSubmit} />
    </AuthShell>
  );
}
