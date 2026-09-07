"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
export const profileKeys = { all: ["profile"] as const, detail: () => [...profileKeys.all, "detail"] as const };
export function useProfile() { return useQuery({ queryKey: profileKeys.detail(), queryFn: () => api.profile.get() }); }
export function useUpdateProfile() { const qc = useQueryClient(); return useMutation({ mutationFn: (payload: unknown) => api.profile.update(payload), onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.all }) }); }
