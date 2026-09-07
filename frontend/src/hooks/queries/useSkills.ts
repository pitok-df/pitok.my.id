"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
export const skillKeys = { all: ["skills"] as const, list: () => [...skillKeys.all, "list"] as const };
export function useSkills() { return useQuery({ queryKey: skillKeys.list(), queryFn: () => api.skills.list() }); }
export function useCreateSkill() { const qc = useQueryClient(); return useMutation({ mutationFn: (payload: unknown) => api.skills.create(payload), onSuccess: () => qc.invalidateQueries({ queryKey: skillKeys.all }) }); }
export function useUpdateSkill() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: unknown }) => api.skills.update(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: skillKeys.all }) }); }
export function useDeleteSkill() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => api.skills.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: skillKeys.all }) }); }
