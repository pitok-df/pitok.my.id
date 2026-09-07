"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
export const certificateKeys = { all: ["certificates"] as const, list: () => [...certificateKeys.all, "list"] as const };
export function useCertificates() { return useQuery({ queryKey: certificateKeys.list(), queryFn: () => api.certificates.list() }); }
export function useCreateCertificate() { const qc = useQueryClient(); return useMutation({ mutationFn: (payload: unknown) => api.certificates.create(payload), onSuccess: () => qc.invalidateQueries({ queryKey: certificateKeys.all }) }); }
export function useUpdateCertificate() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: unknown }) => api.certificates.update(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: certificateKeys.all }) }); }
export function useDeleteCertificate() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => api.certificates.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: certificateKeys.all }) }); }
export function useUploadCertificateImage() { return useMutation({ mutationFn: (file: File) => api.upload.certificate(file) }); }
