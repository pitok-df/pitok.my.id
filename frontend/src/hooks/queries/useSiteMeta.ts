"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
export const siteMetaKeys = { all: ["siteMeta"] as const, detail: () => [...siteMetaKeys.all, "detail"] as const };
export function useSiteMeta() { return useQuery({ queryKey: siteMetaKeys.detail(), queryFn: () => api.siteMeta.get() }); }
export function useUpdateSiteMeta() { const qc = useQueryClient(); return useMutation({ mutationFn: (payload: unknown) => api.siteMeta.update(payload), onSuccess: () => qc.invalidateQueries({ queryKey: siteMetaKeys.all }) }); }
