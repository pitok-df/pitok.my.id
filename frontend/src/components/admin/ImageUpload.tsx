"use client";

import { useMutation } from "@tanstack/react-query";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

type UploadType = "gallery" | "project" | "certificate";

export function ImageUpload({
  value,
  onChange,
  uploadType,
  className,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  uploadType: UploadType;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      switch (uploadType) {
        case "gallery":
          return api.upload.gallery(file);
        case "project":
          return api.upload.project(file);
        case "certificate":
          return api.upload.certificate(file);
      }
    },
    onSuccess: (data) => {
      const files = (data as { files: { url: string }[] })?.files;
      if (files?.[0]?.url) {
        onChange(files[0].url);
      }
    },
  });

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      uploadMutation.mutate(file);
    },
    [uploadMutation, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile],
  );

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const fullSrc = value
    ? value.startsWith("/")
      ? `${backendUrl}${value}`
      : value
    : null;

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {fullSrc ? (
        <div className="relative group w-full max-w-xs">
          <img
            src={fullSrc}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg border border-border"
          />
          <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={uploadMutation.isPending}
            >
              Replace
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onChange(null)}
            >
              <X className="size-3" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={cn(
            "w-full max-w-xs h-40 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors",
            dragOver && "border-foreground/50 bg-muted/50",
          )}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {uploadMutation.isPending ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            <ImagePlus className="size-6" />
          )}
          <span className="text-xs">
            {uploadMutation.isPending ? "Uploading..." : "Click or drag image"}
          </span>
        </button>
      )}

      {uploadMutation.isError && (
        <p className="text-xs text-destructive">Upload failed. Try again.</p>
      )}
    </div>
  );
}
