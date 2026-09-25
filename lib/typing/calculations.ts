export function calculateAccuracy(
  correctChars: number,
  incorrectChars: number,
) {
  const totalChars = correctChars + incorrectChars;

  if (totalChars === 0) {
    return 100;
  }

  return (correctChars / totalChars) * 100;
}

export function calculateWpm(chars: number, elapsedSeconds: number) {
  if (elapsedSeconds <= 0) {
    return 0;
  }

  const minutes = elapsedSeconds / 60;
  return chars / 5 / minutes;
}

export function roundMetric(value: number, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
