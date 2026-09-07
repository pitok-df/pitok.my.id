"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
export const aboutKeys = { all: ["about"] as const, detail: () => [...aboutKeys.all, "detail"] as const };
export function useAbout() { return useQuery({ queryKey: aboutKeys.detail(), queryFn: () => api.about.get() }); }
export function useUpdateAbout() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (payload: unknown) => api.about.update(payload), onSuccess: () => qc.invalidateQueries({ queryKey: aboutKeys.all }) });
}
