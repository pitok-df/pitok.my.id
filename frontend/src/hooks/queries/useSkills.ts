"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { apiClient } from "@/lib/axios";
import { CreateSkillTypeValues } from "@/schemas/skill.schema";

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export const skillKeys = {
  all: ["skills"] as const,
  list: () => [...skillKeys.all, "list"] as const,
};
export function useSkills() {
  return useQuery({
    queryKey: skillKeys.list(),
    queryFn: async () => {
      const rest = await apiClient.get("/skills");
      return rest.data.data as Skill[];
    },
  });
}
export function useCreateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSkillTypeValues) =>
      apiClient.post("/skills", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: skillKeys.all }),
  });
}
export function useUpdateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: unknown }) =>
      apiClient.patch(`/skills/${id}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: skillKeys.all }),
  });
}
export function useDeleteSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete("/skills/" + id),
    onSuccess: () => qc.invalidateQueries({ queryKey: skillKeys.all }),
  });
}
