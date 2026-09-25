"use client";

import { useEffect, useState } from "react";

export function usePressedKeys(enabled = true) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) return;

    const normalize = (key: string) => {
      if (key === " ") return "space";
      if (key === "Backspace") return "backspace";
      return key.toLowerCase();
    };

    const handleDown = (event: KeyboardEvent) => {
      const value = normalize(event.key);
      setPressedKeys((previous) => {
        if (previous.has(value)) return previous;
        const next = new Set(previous);
        next.add(value);
        return next;
      });
    };

    const handleUp = (event: KeyboardEvent) => {
      const value = normalize(event.key);
      setPressedKeys((previous) => {
        if (!previous.has(value)) return previous;
        const next = new Set(previous);
        next.delete(value);
        return next;
      });
    };

    const clear = () => setPressedKeys(new Set());

    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);
    window.addEventListener("blur", clear);

    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
      window.removeEventListener("blur", clear);
    };
  }, [enabled]);

  return pressedKeys;
}
