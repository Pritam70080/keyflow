"use client";

import { useEffect } from "react";

interface UseTypingKeyboardOptions {
  onKey: (key: string) => void;
  onEscape?: () => void;
  enabled?: boolean;
}

export function useTypingKeyboard({
  onKey,
  onEscape,
  enabled = true,
}: UseTypingKeyboardOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        onEscape?.();
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        onKey("Backspace");
        return;
      }

      if (event.key === "Tab") {
        return;
      }

      const key = event.code === "Space" ? " " : event.key.toLowerCase();
      if (key.length !== 1) {
        return;
      }

      event.preventDefault();
      onKey(key);
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [onKey, onEscape, enabled]);
}
