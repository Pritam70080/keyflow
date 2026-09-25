import type { TypingResult } from "@/lib/typing/types";

const HISTORY_KEY = "keyflow.history";
const MAX_HISTORY = 50;

function canUseStorage() {
  return typeof window !== "undefined";
}

export function readHistory(): TypingResult[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TypingResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveResult(result: TypingResult) {
  if (!canUseStorage()) {
    return;
  }

  const history = [result, ...readHistory()].slice(0, MAX_HISTORY);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
