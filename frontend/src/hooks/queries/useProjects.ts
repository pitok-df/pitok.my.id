"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skill } from "./useSkills";
import { apiClient } from "@/lib/axios";

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  demoUrl: string;
  featured: boolean;
  skills: Pick<Skill, "id" | "name">[];
}

export const projectKeys = {
  all: ["projects"] as const,
  list: () => [...projectKeys.all, "list"] as const,
};

export function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: async () => {
      const rest = await apiClient.get("/projects");
      return rest.data.data as Project[];
    },
  });
}
export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: unknown) => apiClient.post("/projects", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  });
}
export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: unknown }) =>
      apiClient.patch(`/projects/${id}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  });
}
export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/projects/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  });
}
export function useUploadProjectImage() {
  return useMutation({ mutationFn: (file: File) => api.upload.project(file) });
}
