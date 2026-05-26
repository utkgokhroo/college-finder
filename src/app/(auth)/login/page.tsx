"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthForm, AuthFormData } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default function LoginPage() {
  const { login, isLoggedIn } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) router.replace("/colleges");
  }, [isLoggedIn, router]);

  const handleSubmit = async ({ email, password }: AuthFormData) => {
    await login(email, password);
    router.push("/colleges");
  };

  return (
    <AuthShell mode="login">
      <AuthForm mode="login" onSubmit={handleSubmit} />
    </AuthShell>
  );
}
