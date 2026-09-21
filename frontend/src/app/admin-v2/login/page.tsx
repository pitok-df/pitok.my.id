"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginForm } from "@/components/login-form";
import type { LoginSchema } from "@/schemas/auth.schema";
import { useLogin } from "@/hooks/queries/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { mutateAsync } = useLogin();

  const handleLogin = async (data: LoginSchema) => {
    try {
      await mutateAsync({ email: data.email, password: data.password });
      toast.success("Berhasil login");
      router.push("/admin-v2");
    } catch (error) {
      console.error("Login error: ", error);
      throw error;
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}
