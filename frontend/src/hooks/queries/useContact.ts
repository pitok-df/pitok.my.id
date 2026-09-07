"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
export const contactKeys = { all: ["contact"] as const, detail: () => [...contactKeys.all, "detail"] as const };
export function useContact() { return useQuery({ queryKey: contactKeys.detail(), queryFn: () => api.contact.get() }); }
export function useUpdateContact() { const qc = useQueryClient(); return useMutation({ mutationFn: (payload: unknown) => api.contact.update(payload), onSuccess: () => qc.invalidateQueries({ queryKey: contactKeys.all }) }); }
