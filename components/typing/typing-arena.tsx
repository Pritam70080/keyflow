"use client";

import dynamic from "next/dynamic";
import { RotateCcw, Vibrate, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AppHeader } from "@/components/app-header";
import { OptionPills } from "@/components/option-pills";
import { TypingText } from "@/components/typing/typing-text";
import { VirtualKeyboard } from "@/components/typing/virtual-keyboard";
import { Button } from "@/components/ui/button";
import { usePressedKeys } from "@/hooks/use-pressed-keys";
import { useTypingEngine } from "@/hooks/use-typing-engine";
import { useTypingKeyboard } from "@/hooks/use-typing-keyboard";
import { playKeySound } from "@/lib/typing/audio";
import { triggerHaptic } from "@/lib/typing/haptic";
import { useTypingPreferences } from "@/lib/typing/preferences";
import { readHistory, saveResult } from "@/lib/typing/storage";
import type {
  TypingDifficulty,
  TypingDuration,
  TypingResult,
} from "@/lib/typing/types";
import { generatePassage } from "@/lib/typing/word-banks";

const ProgressChart = dynamic(
  () =>
    import("@/components/progress/progress-chart").then(
      (module) => module.ProgressChart,
    ),
  { ssr: false },
);

const DURATIONS = [
  { value: 15 as const, label: "15s" },
  { value: 30 as const, label: "30s" },
  { value: 60 as const, label: "60s" },
  { value: 120 as const, label: "120s" },
];

const DIFFICULTIES = [
  { value: "easy" as const, label: "Easy" },
  { value: "medium" as const, label: "Medium" },
  { value: "hard" as const, label: "Hard" },
];

export function TypingArena() {
  const sound = useTypingPreferences((state) => state.sound);
  const haptic = useTypingPreferences((state) => state.haptic);
  const duration = useTypingPreferences((state) => state.duration);
  const difficulty = useTypingPreferences((state) => state.difficulty);
  const setSound = useTypingPreferences((state) => state.setSound);
  const setHaptic = useTypingPreferences((state) => state.setHaptic);
  const setDuration = useTypingPreferences((state) => state.setDuration);
  const setDifficulty = useTypingPreferences((state) => state.setDifficulty);

  const [text, setText] = useState("");
  const [recentResults, setRecentResults] = useState<TypingResult[]>([]);
  const savedResultId = useRef<string | null>(null);

  const {
    status,
    currentIndex,
    statuses,
    correctChars,
    incorrectChars,
    finishedAt,
    remainingSeconds,
    accuracy,
    wpm,
    rawWpm,
    handleKey: applyKey,
    reset,
  } = useTypingEngine(text, duration);

  const pressedKeys = usePressedKeys(status !== "finished");
  const expectedKey = text[currentIndex];

  const restart = useCallback(
    (
      nextDifficulty: TypingDifficulty = useTypingPreferences.getState()
        .difficulty,
      nextDuration: TypingDuration = useTypingPreferences.getState().duration,
    ) => {
      const nextText = generatePassage(nextDifficulty);
      savedResultId.current = null;
      setText(nextText);
      reset(nextDuration, nextText.length);
    },
    [reset],
  );

  useEffect(() => {
    const startWithPreferences = () => {
      const prefs = useTypingPreferences.getState();
      const nextText = generatePassage(prefs.difficulty);
      setText(nextText);
      reset(prefs.duration, nextText.length);
    };

    const unsubscribe = useTypingPreferences.persist.onFinishHydration(() => {
      startWithPreferences();
    });

    if (useTypingPreferences.persist.hasHydrated()) {
      startWithPreferences();
    }

    setRecentResults(readHistory().slice(0, 12));
    return unsubscribe;
  }, [reset]);

  const handleKey = useCallback(
    (key: string) => {
      if (status === "finished") {
        return;
      }

      const currentExpected = text[currentIndex];
      const kind =
        key === "Backspace"
          ? "backspace"
          : currentExpected !== undefined && key === currentExpected
            ? "correct"
            : "incorrect";

      applyKey(key);

      const prefs = useTypingPreferences.getState();
      if (prefs.sound !== "off") {
        playKeySound(prefs.sound, kind);
      }
      if (prefs.haptic) {
        triggerHaptic(kind);
      }
    },
    [applyKey, currentIndex, status, text],
  );

  useTypingKeyboard({
    onKey: handleKey,
    onEscape: () => restart(),
    enabled: status !== "finished",
  });

  useEffect(() => {
    if (status !== "finished" || !finishedAt) {
      return;
    }

    const resultId = `${finishedAt}-${wpm}-${accuracy}`;
    if (savedResultId.current === resultId) {
      return;
    }

    const prefs = useTypingPreferences.getState();
    const result: TypingResult = {
      id: resultId,
      completedAt: finishedAt,
      wpm,
      rawWpm,
      accuracy,
      duration: prefs.duration,
      difficulty: prefs.difficulty,
      correctChars,
      incorrectChars,
    };

    savedResultId.current = resultId;
    saveResult(result);
    setRecentResults((previous) => [result, ...previous].slice(0, 12));
  }, [
    status,
    finishedAt,
    wpm,
    rawWpm,
    accuracy,
    correctChars,
    incorrectChars,
  ]);

  const remainingLabel = useMemo(() => {
    return Math.ceil(remainingSeconds);
  }, [remainingSeconds]);

  const cycleSound = () => {
    const order = ["off", "click", "mechanical"] as const;
    const next = order[(order.indexOf(sound) + 1) % order.length];
    setSound(next);
  };

  return (
    <main className="min-h-screen overflow-x-hidden">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pt-4 sm:px-5 md:px-8">
        <AppHeader />

        <section className="flex min-h-0 flex-1 flex-col justify-start gap-6 overflow-x-hidden py-4 sm:gap-8 md:justify-between md:gap-7 md:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <OptionPills
                ariaLabel="Difficulty"
                value={difficulty}
                options={DIFFICULTIES}
                disabled={status === "running"}
                onChange={(value) => {
                  setDifficulty(value);
                  restart(value, duration);
                }}
              />
              <OptionPills
                ariaLabel="Duration"
                value={duration}
                options={DURATIONS}
                disabled={status === "running"}
                onChange={(value) => {
                  setDuration(value);
                  restart(difficulty, value);
                }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={cycleSound}
                aria-label={`Sound: ${sound}`}
              >
                {sound === "off" ? (
                  <VolumeX className="size-4" />
                ) : (
                  <Volume2 className="size-4" />
                )}
                <span className="capitalize">{sound}</span>
              </Button>
              <Button
                variant={haptic ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setHaptic(!haptic)}
                aria-label={haptic ? "Disable haptics" : "Enable haptics"}
              >
                <Vibrate className="size-4" />
                Haptic
              </Button>
              <Button variant="ghost" size="sm" onClick={() => restart()}>
                <RotateCcw className="size-4" />
                Restart
              </Button>
            </div>
          </div>

          <div
            className="grid max-w-md grid-cols-3 gap-3 font-mono text-xs text-muted-foreground sm:gap-6 sm:text-sm"
            aria-live="polite"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.18em]">time</p>
              <p className="text-2xl text-foreground">{remainingLabel}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em]">wpm</p>
              <p className="text-2xl text-foreground">{wpm}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em]">acc</p>
              <p className="text-2xl text-foreground">{accuracy}%</p>
            </div>
          </div>

          {status === "finished" ? (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Session complete</p>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Stat label="WPM" value={String(wpm)} />
                <Stat label="Raw" value={String(rawWpm)} />
                <Stat label="Accuracy" value={`${accuracy}%`} />
                <Stat
                  label="Chars"
                  value={`${correctChars}/${correctChars + incorrectChars}`}
                />
              </div>
              <div className="mt-6">
                <ProgressChart results={recentResults} />
              </div>
              <Button className="mt-6" onClick={() => restart()}>
                Start another test
              </Button>
            </div>
          ) : (
            <div>
              {text ? (
                <TypingText
                  text={text}
                  currentIndex={currentIndex}
                  statuses={statuses}
                />
              ) : (
                <p className="font-mono text-2xl text-muted-foreground">
                  Preparing a passage…
                </p>
              )}
              <p className="mt-5 text-sm text-muted-foreground">
                {status === "idle"
                  ? "Start typing whenever you are ready. Esc restarts."
                  : "Keep going. Backspace fixes mistakes."}
              </p>
            </div>
          )}

          <VirtualKeyboard
            onKey={handleKey}
            disabled={status === "finished"}
            pressedKeys={pressedKeys}
            expectedKey={expectedKey}
          />
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl">{value}</p>
    </div>
  );
}
