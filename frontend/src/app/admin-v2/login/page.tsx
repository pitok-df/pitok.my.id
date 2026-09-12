"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { LoginForm } from "@/components/login-form";
import type { LoginSchema } from "@/schemas/auth.schema";
import { apiClient } from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: LoginSchema) => {
    try {
      const res = await apiClient.post("/auth/login", data);

      console.log("Login response: ", res.data);
      toast.success("Berhasil login");
      router.push("/admin");
    } catch (error) {
      console.error("Login error: ", error);
      throw error;
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}
