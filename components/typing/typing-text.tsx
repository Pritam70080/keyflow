"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { CharacterStatus } from "@/lib/typing/types";

interface TypingTextProps {
  text: string;
  currentIndex: number;
  statuses: CharacterStatus[];
}

export function TypingText({
  text,
  currentIndex,
  statuses,
}: TypingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  const [caretPosition, setCaretPosition] = useState({
    left: 0,
    top: 0,
    height: 28,
  });

  useLayoutEffect(() => {
    const container = containerRef.current;
    const currentCharacter =
      characterRefs.current[currentIndex] ??
      characterRefs.current[characterRefs.current.length - 1];

    if (!container || !currentCharacter) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const characterRect = currentCharacter.getBoundingClientRect();
    const finished = currentIndex >= text.length;

    setCaretPosition({
      left:
        characterRect.left -
        containerRect.left +
        (finished ? characterRect.width : 0),
      top: characterRect.top - containerRect.top + container.scrollTop,
      height: characterRect.height,
    });

    const lineTop =
      characterRect.top - containerRect.top + container.scrollTop;
    const lineBottom = lineTop + characterRect.height;
    const visibleTop = container.scrollTop;
    const visibleBottom = container.scrollTop + container.clientHeight;
    const padding = 48;

    if (lineBottom > visibleBottom - padding) {
      container.scrollTo({
        top: lineBottom - container.clientHeight + padding,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    } else if (lineTop < visibleTop + padding) {
      container.scrollTo({
        top: Math.max(0, lineTop - padding),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }
  }, [currentIndex, text.length, reduceMotion]);

  const words = text.split(" ");
  let globalIndex = 0;

  return (
    <div
      ref={containerRef}
      className="relative max-h-42 overflow-hidden font-mono text-[1.35rem] leading-[1.9] tracking-wide md:max-h-50 md:text-[1.85rem] md:leading-[2.15]"
    >
      <p className="relative text-pretty">
        {words.map((word, wordIndex) => {
          const startIndex = globalIndex;
          const letters = word.split("");
          globalIndex += letters.length + (wordIndex < words.length - 1 ? 1 : 0);

          return (
            <span
              key={`${word}-${startIndex}`}
              className="mr-[0.45em] inline-block"
            >
              {letters.map((character, letterIndex) => {
                const index = startIndex + letterIndex;
                const status = statuses[index] ?? "pending";

                return (
                  <span
                    key={`${index}-${character}`}
                    ref={(element) => {
                      characterRefs.current[index] = element;
                    }}
                    className={cn(
                      "relative inline-block transition-colors duration-150",
                      status === "pending" && "text-muted-foreground/55",
                      status === "correct" && "text-foreground",
                      status === "incorrect" &&
                        "text-error underline decoration-error/80 decoration-2 underline-offset-4",
                    )}
                  >
                    {character}
                  </span>
                );
              })}
              {wordIndex < words.length - 1 ? (
                <span
                  ref={(element) => {
                    characterRefs.current[startIndex + letters.length] = element;
                  }}
                  className={cn(
                    "inline-block w-[0.45em]",
                    statuses[startIndex + letters.length] === "incorrect" &&
                      "rounded-sm bg-error/25",
                  )}
                >
                  {"\u00A0"}
                </span>
              ) : null}
            </span>
          );
        })}
      </p>

      <motion.span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-[2px] rounded-full bg-accent"
        animate={{
          x: caretPosition.left,
          y: caretPosition.top,
          height: caretPosition.height,
        }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 520, damping: 38, mass: 0.4 }
        }
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
