"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
export const authKeys = { all: ["auth"] as const, me: () => [...authKeys.all, "me"] as const };
export function useMe() {
  return useQuery({ queryKey: authKeys.me(), queryFn: () => api.auth.me(), retry: false });
}
export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) => api.auth.login(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: authKeys.all }),
  });
}
export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.auth.logout(),
    onSuccess: () => qc.clear(),
  });
}
