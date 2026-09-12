"use client";

import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginSchema, type LoginSchema } from "@/schemas/auth.schema";
import { FormBuilder } from "./form";

interface LoginFormProps {
  onSubmit: (data: LoginSchema) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const handleSubmit = async (data: LoginSchema) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Email atau password salah");
      throw error;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg font-medium">Admin Login</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Masuk untuk mengelola data portofolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormBuilder<LoginSchema>
            fields={[
              {
                name: "email",
                type: "email",
                label: "Email",
                placeholder: "Masukkan email",
              },
              {
                name: "password",
                type: "password",
                label: "Password",
                placeholder: "Masukkan password",
              },
            ]}
            schema={loginSchema}
            onSubmit={handleSubmit}
            submitText="Login"
          />
        </CardContent>
      </Card>
    </div>
  );
}
