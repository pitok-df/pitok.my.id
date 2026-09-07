"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
export const educationKeys = { all: ["educations"] as const, list: () => [...educationKeys.all, "list"] as const };
export function useEducations() { return useQuery({ queryKey: educationKeys.list(), queryFn: () => api.educations.list() }); }
export function useCreateEducation() { const qc = useQueryClient(); return useMutation({ mutationFn: (payload: unknown) => api.educations.create(payload), onSuccess: () => qc.invalidateQueries({ queryKey: educationKeys.all }) }); }
export function useUpdateEducation() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: unknown }) => api.educations.update(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: educationKeys.all }) }); }
export function useDeleteEducation() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => api.educations.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: educationKeys.all }) }); }
