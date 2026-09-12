"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface InputCurrencyProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  value?: number;
  onValueChange?: (value: number | undefined) => void;
  currency?: string;
  locale?: string;
}

export const InputCurrency = forwardRef<HTMLInputElement, InputCurrencyProps>(
  (
    {
      className,
      value,
      onValueChange,
      currency = "IDR",
      locale = "id-ID",
      ...props
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^0-9]/g, "");
      const numericValue = rawValue ? Number(rawValue) : undefined;
      onValueChange?.(numericValue);
    };

    const formattedValue =
      value !== undefined
        ? new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value)
        : "";

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={formattedValue}
        onChange={handleChange}
        className={cn("tabular-nums", className)}
        {...props}
      />
    );
  },
);

InputCurrency.displayName = "InputCurrency";

export default InputCurrency;
