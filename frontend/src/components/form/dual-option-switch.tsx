"use client";

import { cn } from "@/lib/utils";

export interface DualOptionSwitchOption {
  label: string;
  value: unknown;
  activeClass?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface DualOptionSwitchProps {
  options: {
    left: DualOptionSwitchOption;
    right: DualOptionSwitchOption;
  };
  value?: unknown;
  onValueChange?: (value: unknown) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function DualOptionSwitch({
  options,
  value,
  onValueChange,
  disabled = false,
  className,
  id,
}: DualOptionSwitchProps) {
  const isLeft = value === options.left.value;
  const active = isLeft ? options.left : options.right;

  const LeftIcon = options.left.icon;
  const RightIcon = options.right.icon;

  return (
    <div
      id={id}
      className={cn(
        "relative inline-flex h-9 w-full rounded-lg border bg-muted p-1",
        className,
      )}
      role="radiogroup"
    >
      <div
        className={cn(
          "absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-md bg-primary shadow-sm transition-transform duration-200 ease-out",
          isLeft ? "translate-x-0" : "translate-x-full",
          active.activeClass,
        )}
        aria-hidden="true"
      />

      <button
        type="button"
        className={cn(
          "relative z-10 flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isLeft
            ? "text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
          disabled && "cursor-not-allowed opacity-50",
        )}
        disabled={disabled}
        onClick={() => onValueChange?.(options.left.value)}
        role="radio"
        aria-checked={isLeft}
      >
        {LeftIcon && <LeftIcon className="h-4 w-4" />}
        {options.left.label}
      </button>

      <button
        type="button"
        className={cn(
          "relative z-10 flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          !isLeft
            ? "text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
          disabled && "cursor-not-allowed opacity-50",
        )}
        disabled={disabled}
        onClick={() => onValueChange?.(options.right.value)}
        role="radio"
        aria-checked={!isLeft}
      >
        {RightIcon && <RightIcon className="h-4 w-4" />}
        {options.right.label}
      </button>
    </div>
  );
}
