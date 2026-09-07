"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
export const projectKeys = { all: ["projects"] as const, list: () => [...projectKeys.all, "list"] as const };
export function useProjects() { return useQuery({ queryKey: projectKeys.list(), queryFn: () => api.projects.list() }); }
export function useCreateProject() { const qc = useQueryClient(); return useMutation({ mutationFn: (payload: unknown) => api.projects.create(payload), onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }) }); }
export function useUpdateProject() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: unknown }) => api.projects.update(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }) }); }
export function useDeleteProject() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => api.projects.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }) }); }
export function useUploadProjectImage() { return useMutation({ mutationFn: (file: File) => api.upload.project(file) }); }
