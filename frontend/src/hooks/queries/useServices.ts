"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
export const serviceKeys = { all: ["services"] as const, list: () => [...serviceKeys.all, "list"] as const };
export function useServices() { return useQuery({ queryKey: serviceKeys.list(), queryFn: () => api.services.list() }); }
export function useCreateService() { const qc = useQueryClient(); return useMutation({ mutationFn: (payload: unknown) => api.services.create(payload), onSuccess: () => qc.invalidateQueries({ queryKey: serviceKeys.all }) }); }
export function useUpdateService() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: unknown }) => api.services.update(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: serviceKeys.all }) }); }
export function useDeleteService() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => api.services.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: serviceKeys.all }) }); }
