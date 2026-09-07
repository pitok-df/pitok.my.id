"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const heroKeys = {
  all: ["hero"] as const,
  detail: () => [...heroKeys.all, "detail"] as const,
};

export function useHero() {
  return useQuery({
    queryKey: heroKeys.detail(),
    queryFn: () => api.hero.get(),
  });
}

export function useUpdateHero() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: unknown) => api.hero.update(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: heroKeys.all }),
  });
}
