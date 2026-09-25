export function triggerHaptic(kind: "correct" | "incorrect" | "backspace") {
  if (typeof navigator === "undefined" || !navigator.vibrate) {
    return;
  }

  if (kind === "incorrect") {
    navigator.vibrate([10, 24, 10]);
    return;
  }

  navigator.vibrate(kind === "backspace" ? 6 : 8);
}
