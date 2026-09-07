"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
export const experienceKeys = { all: ["experiences"] as const, list: () => [...experienceKeys.all, "list"] as const };
export function useExperiences() { return useQuery({ queryKey: experienceKeys.list(), queryFn: () => api.experiences.list() }); }
export function useCreateExperience() { const qc = useQueryClient(); return useMutation({ mutationFn: (payload: unknown) => api.experiences.create(payload), onSuccess: () => qc.invalidateQueries({ queryKey: experienceKeys.all }) }); }
export function useUpdateExperience() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: unknown }) => api.experiences.update(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: experienceKeys.all }) }); }
export function useDeleteExperience() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => api.experiences.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: experienceKeys.all }) }); }
