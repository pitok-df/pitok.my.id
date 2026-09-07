"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
export const galleryKeys = { all: ["gallery"] as const, list: () => [...galleryKeys.all, "list"] as const };
export function useGallery() { return useQuery({ queryKey: galleryKeys.list(), queryFn: () => api.gallery.list() }); }
export function useCreateGallery() { const qc = useQueryClient(); return useMutation({ mutationFn: (payload: unknown) => api.gallery.create(payload), onSuccess: () => qc.invalidateQueries({ queryKey: galleryKeys.all }) }); }
export function useUpdateGallery() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: unknown }) => api.gallery.update(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: galleryKeys.all }) }); }
export function useDeleteGallery() { const qc = useQueryClient(); return useMutation({ mutationFn: (id: string) => api.gallery.remove(id), onSuccess: () => qc.invalidateQueries({ queryKey: galleryKeys.all }) }); }
export function useUploadGalleryImage() { return useMutation({ mutationFn: (file: File) => api.upload.gallery(file) }); }
