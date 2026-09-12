"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface DatePickerProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ id, value, onChange, onValueChange, placeholder, className, disabled }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange?.(newValue);
      onValueChange?.(newValue);
    };

    return (
      <Input
        ref={ref}
        id={id}
        type="date"
        value={value ?? ""}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn("w-full", className)}
        disabled={disabled}
      />
    );
  },
);

DatePicker.displayName = "DatePicker";
