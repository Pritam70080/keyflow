"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

interface OptionPillProps<T extends string | number> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  disabled?: boolean;
  ariaLabel: string;
}

export function OptionPills<T extends string | number>({
  value,
  options,
  onChange,
  disabled,
  ariaLabel,
}: OptionPillProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="relative flex items-center gap-1 rounded-full bg-muted p-1"
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={String(option.value)}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative z-10 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              selected
                ? "text-accent-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {selected ? (
              <motion.span
                layoutId={`${ariaLabel}-pill`}
                className="absolute inset-0 -z-10 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            ) : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
