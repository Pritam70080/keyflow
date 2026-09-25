"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  calculateAccuracy,
  calculateWpm,
  roundMetric,
} from "@/lib/typing/calculations";
import type {
  CharacterStatus,
  TypingDuration,
  TypingState,
} from "@/lib/typing/types";

function createStatuses(length: number): CharacterStatus[] {
  return Array.from({ length }, () => "pending");
}

function createInitialState(
  duration: TypingDuration,
  textLength: number,
): TypingState {
  return {
    currentIndex: 0,
    statuses: createStatuses(textLength),
    correctChars: 0,
    incorrectChars: 0,
    startedAt: null,
    finishedAt: null,
    status: "idle",
    duration,
  };
}

export function useTypingEngine(text: string, duration: TypingDuration) {
  const [state, setState] = useState<TypingState>(() =>
    createInitialState(duration, text.length),
  );
  const [now, setNow] = useState<number | null>(null);
  const deadlineRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const textRef = useRef(text);
  const durationRef = useRef(duration);

  textRef.current = text;
  durationRef.current = duration;

  const clearTimer = useCallback(() => {
    deadlineRef.current = null;
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const armTimer = useCallback(
    (startedAt: number) => {
      const nextDuration = durationRef.current;
      clearTimer();
      deadlineRef.current = startedAt + nextDuration * 1000;
      timeoutRef.current = window.setTimeout(() => {
        setState((previous) => {
          if (previous.status !== "running") {
            return previous;
          }

          return {
            ...previous,
            status: "finished",
            finishedAt: Date.now(),
          };
        });
        deadlineRef.current = null;
        timeoutRef.current = null;
      }, nextDuration * 1000);
    },
    [clearTimer],
  );

  useEffect(() => {
    if (state.status !== "running") {
      return;
    }

    const interval = window.setInterval(() => {
      const currentTime = Date.now();
      setNow(currentTime);

      if (deadlineRef.current !== null && currentTime >= deadlineRef.current) {
        setState((previous) => {
          if (previous.status !== "running") {
            return previous;
          }

          return {
            ...previous,
            status: "finished",
            finishedAt: currentTime,
          };
        });
        clearTimer();
      }
    }, 100);

    return () => window.clearInterval(interval);
  }, [state.status, clearTimer]);

  const handleKey = useCallback(
    (key: string) => {
      const currentText = textRef.current;

      if (key === "Backspace") {
        setState((previous) => {
          if (previous.currentIndex === 0 || previous.status === "finished") {
            return previous;
          }

          const nextIndex = previous.currentIndex - 1;
          const previousResult = previous.statuses[nextIndex];
          const statuses = [...previous.statuses];
          statuses[nextIndex] = "pending";

          return {
            ...previous,
            currentIndex: nextIndex,
            statuses,
            correctChars:
              previous.correctChars - (previousResult === "correct" ? 1 : 0),
            incorrectChars:
              previous.incorrectChars -
              (previousResult === "incorrect" ? 1 : 0),
          };
        });
        return;
      }

      if (key.length !== 1) {
        return;
      }

      setState((previous) => {
        if (previous.status === "finished") {
          return previous;
        }

        const expectedCharacter = currentText[previous.currentIndex];
        if (expectedCharacter === undefined) {
          return previous;
        }

        const isCorrect = key === expectedCharacter;
        const statuses = [...previous.statuses];
        statuses[previous.currentIndex] = isCorrect ? "correct" : "incorrect";
        const nextIndex = previous.currentIndex + 1;
        const completed = nextIndex >= currentText.length;
        const startedAt = previous.startedAt ?? Date.now();

        if (!previous.startedAt) {
          armTimer(startedAt);
        }

        if (completed) {
          window.setTimeout(clearTimer, 0);
        }

        return {
          ...previous,
          currentIndex: nextIndex,
          statuses,
          correctChars: previous.correctChars + (isCorrect ? 1 : 0),
          incorrectChars: previous.incorrectChars + (isCorrect ? 0 : 1),
          startedAt,
          status: completed ? "finished" : "running",
          finishedAt: completed ? Date.now() : previous.finishedAt,
        };
      });
    },
    [armTimer, clearTimer],
  );

  const elapsedSeconds = useMemo(() => {
    if (!state.startedAt) {
      return 0;
    }

    const endTime = state.finishedAt ?? now ?? Date.now();
    return Math.max(0, (endTime - state.startedAt) / 1000);
  }, [state.startedAt, state.finishedAt, now]);

  const remainingSeconds = useMemo(() => {
    if (!state.startedAt) {
      return state.duration;
    }

    return Math.max(0, state.duration - elapsedSeconds);
  }, [state.startedAt, state.duration, elapsedSeconds]);

  const accuracy = useMemo(() => {
    return roundMetric(
      calculateAccuracy(state.correctChars, state.incorrectChars),
    );
  }, [state.correctChars, state.incorrectChars]);

  const typedChars = state.correctChars + state.incorrectChars;

  const wpm = useMemo(() => {
    return roundMetric(calculateWpm(state.correctChars, elapsedSeconds));
  }, [state.correctChars, elapsedSeconds]);

  const rawWpm = useMemo(() => {
    return roundMetric(calculateWpm(typedChars, elapsedSeconds));
  }, [typedChars, elapsedSeconds]);

  const reset = useCallback(
    (nextDuration = durationRef.current, nextLength = textRef.current.length) => {
      clearTimer();
      setNow(null);
      setState(createInitialState(nextDuration, nextLength));
    },
    [clearTimer],
  );

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    status: state.status,
    duration: state.duration,
    currentIndex: state.currentIndex,
    statuses: state.statuses,
    correctChars: state.correctChars,
    incorrectChars: state.incorrectChars,
    startedAt: state.startedAt,
    finishedAt: state.finishedAt,
    elapsedSeconds,
    remainingSeconds,
    accuracy,
    wpm,
    rawWpm,
    handleKey,
    reset,
  };
}
