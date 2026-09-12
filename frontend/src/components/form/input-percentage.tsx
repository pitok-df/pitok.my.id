"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface InputPercentageProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  value?: number;
  onValueChange?: (value: number | undefined) => void;
}

export const InputPercentage = forwardRef<HTMLInputElement, InputPercentageProps>(
  ({ className, value, onValueChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^0-9.]/g, "");
      const numericValue = rawValue ? parseFloat(rawValue) : undefined;

      // Clamp between 0-100
      if (numericValue !== undefined) {
        const clamped = Math.min(100, Math.max(0, numericValue));
        onValueChange?.(clamped);
      } else {
        onValueChange?.(undefined);
      }
    };

    const displayValue = value !== undefined ? `${value}%` : "";

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          className={cn("pr-8 tabular-nums", className)}
          {...props}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          %
        </span>
      </div>
    );
  },
);

InputPercentage.displayName = "InputPercentage";
