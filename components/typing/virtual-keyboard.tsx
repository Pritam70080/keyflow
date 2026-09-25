"use client";

import { Delete } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { KEYBOARD_ROWS } from "@/components/typing/keyboard-layout";
import { cn } from "@/lib/utils";

interface VirtualKeyboardProps {
  onKey: (key: string) => void;
  disabled?: boolean;
  pressedKeys: Set<string>;
  expectedKey?: string;
}

function KeyCap({
  label,
  value,
  wide,
  extraWide,
  active,
  expected,
  disabled,
  onKey,
}: {
  label: ReactNode;
  value: string;
  wide?: boolean;
  extraWide?: boolean;
  active: boolean;
  expected: boolean;
  disabled?: boolean;
  onKey: (key: string) => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onPointerDown={(event) => {
        event.preventDefault();
        onKey(value);
      }}
      animate={{
        scale: active ? 0.94 : 1,
        y: active ? 2 : 0,
      }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 620, damping: 32, mass: 0.3 }
      }
      className={cn(
        "flex h-9 min-w-0 items-center justify-center rounded-xl border border-border/80 bg-keyboard text-[0.65rem] font-medium text-keyboard-foreground shadow-[0_2px_0_var(--border)] select-none sm:h-11 sm:text-sm",
        wide && "flex-[1.4] px-2 sm:px-3",
        extraWide && "w-[16rem] md:w-[26rem]",
        !wide && !extraWide && "flex-1",
        expected && "border-accent bg-accent/25 text-foreground",
        active && "border-accent bg-keyboard-active text-accent-foreground",
      )}
    >
      {label}
    </motion.button>
  );
}

export function VirtualKeyboard({
  onKey,
  disabled = false,
  pressedKeys,
  expectedKey,
}: VirtualKeyboardProps) {
  const expected = expectedKey === " " ? "space" : expectedKey?.toLowerCase();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-1.5 overflow-x-hidden sm:gap-2">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={row.join("")} className="flex justify-center gap-1.5 sm:gap-2">
          {rowIndex === 2 ? (
            <KeyCap
              label={<Delete className="size-4" />}
              value="Backspace"
              wide
              active={pressedKeys.has("backspace")}
              expected={expected === "backspace"}
              disabled={disabled}
              onKey={onKey}
            />
          ) : null}
          {row.map((key) => (
            <KeyCap
              key={key}
              label={key}
              value={key}
              active={pressedKeys.has(key)}
              expected={expected === key}
              disabled={disabled}
              onKey={onKey}
            />
          ))}
        </div>
      ))}

      <div className="flex justify-center gap-2">
        <KeyCap
          label="space"
          value=" "
          extraWide
          active={pressedKeys.has("space")}
          expected={expected === "space"}
          disabled={disabled}
          onKey={onKey}
        />
      </div>
    </div>
  );
}
