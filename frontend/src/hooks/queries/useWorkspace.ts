"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
export const workspaceKeys = { all: ["workspace"] as const, detail: () => [...workspaceKeys.all, "detail"] as const };
export function useWorkspace() { return useQuery({ queryKey: workspaceKeys.detail(), queryFn: () => api.workspace.get() }); }
export function useUpdateWorkspace() { const qc = useQueryClient(); return useMutation({ mutationFn: (payload: unknown) => api.workspace.update(payload), onSuccess: () => qc.invalidateQueries({ queryKey: workspaceKeys.all }) }); }
