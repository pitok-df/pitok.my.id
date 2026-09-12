"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface SegmentedControlOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  disabled = false,
  size = "md",
  className,
  id,
}: SegmentedControlProps) {
  const sizeClasses = {
    sm: "h-8 text-xs",
    md: "h-10 text-sm",
    lg: "h-12 text-base",
  };

  return (
    <div
      id={id}
      className={cn(
        "inline-flex rounded-lg border bg-muted p-1",
        className,
      )}
      role="radiogroup"
    >
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-md px-3",
            sizeClasses[size],
            value === option.value &&
              "bg-background shadow-sm text-foreground",
            option.disabled && "opacity-50 cursor-not-allowed",
          )}
          disabled={disabled || option.disabled}
          onClick={() => onChange?.(option.value)}
          role="radio"
          aria-checked={value === option.value}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
