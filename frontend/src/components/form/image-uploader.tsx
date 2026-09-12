"use client";

import { useCallback, useState } from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { Upload, X, FileIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type FileUploaderVariant = "default" | "image" | "avatar";

export interface FileUploaderProps {
  value?: File | File[] | string | null;
  onValueChange?: (value: File | File[] | undefined) => void;
  helperText?: string;
  disabled?: boolean;
  maxSize?: number;
  accept?: DropzoneOptions["accept"];
  variant?: FileUploaderVariant;
  multiple?: boolean;
  className?: string;
}

export function FileUploader({
  value,
  onValueChange,
  helperText,
  disabled = false,
  maxSize = 5 * 1024 * 1024,
  accept,
  variant = "default",
  multiple = false,
  className,
}: FileUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = multiple ? acceptedFiles : acceptedFiles[0];
      onValueChange?.(file as File | File[]);

      if (variant === "image" || variant === "avatar") {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file as File);
      }
    },
    [onValueChange, variant, multiple],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    maxSize,
    accept,
    multiple,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onValueChange?.(undefined);
  };

  const hasValue = value && (value instanceof File || preview);
  const fileName =
    value instanceof File ? value.name : null;

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-lg border-2 border-dashed transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed",
          !hasValue && "cursor-pointer",
          variant === "avatar"
            ? "w-32 h-32 rounded-full mx-auto flex items-center justify-center"
            : hasValue
              ? "p-3"
              : "p-6",
        )}
      >
        <input {...getInputProps()} />

        {hasValue ? (
          <div className="flex items-center gap-3">
            {preview && variant !== "avatar" && (
              <div className="shrink-0">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-16 w-16 rounded-md object-cover"
                />
              </div>
            )}
            {preview && variant === "avatar" && (
              <img
                src={preview}
                alt="Preview"
                className="h-20 w-20 rounded-full object-cover mx-auto"
              />
            )}
            {!preview && fileName && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">{fileName}</span>
              </div>
            )}
            {!preview && !fileName && value instanceof File && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">File</span>
              </div>
            )}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 size-6 shrink-0"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            {variant === "image" ? (
              <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground/50" />
            )}
            <div>
              <p className="text-sm font-medium">
                {isDragActive ? "Drop file di sini..." : "Klik atau drag file"}
              </p>
              {helperText && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {helperText}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
