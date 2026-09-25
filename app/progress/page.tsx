"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { ProgressChart } from "@/components/progress/progress-chart";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { readHistory } from "@/lib/typing/storage";
import type { TypingResult } from "@/lib/typing/types";
import { roundMetric } from "@/lib/typing/calculations";

export default function ProgressPage() {
  const [results, setResults] = useState<TypingResult[]>([]);

  useEffect(() => {
    setResults(readHistory());
  }, []);

  const averages = useMemo(() => {
    if (results.length === 0) {
      return { wpm: 0, accuracy: 0 };
    }

    const wpm =
      results.reduce((sum, result) => sum + result.wpm, 0) / results.length;
    const accuracy =
      results.reduce((sum, result) => sum + result.accuracy, 0) /
      results.length;

    return {
      wpm: roundMetric(wpm),
      accuracy: roundMetric(accuracy),
    };
  }, [results]);

  return (
    <main id="main" className="min-h-screen">
      <div className="mx-auto max-w-5xl w-full px-5 py-4 md:px-8">
        <AppHeader />

        <section className="py-8">
          <h1 className="text-3xl font-semibold tracking-tight">Progress</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Recent tests saved on this browser. Averages update as you complete
            more sessions.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <SummaryCard label="Tests" value={String(results.length)} />
            <SummaryCard label="Avg WPM" value={String(averages.wpm)} />
            <SummaryCard label="Avg accuracy" value={`${averages.accuracy}%`} />
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 text-sm font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Speed over time
            </h2>
            <ProgressChart results={results} />
          </div>

          <ol className="mt-8 space-y-3">
            {results.map((result) => (
              <li
                key={result.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm"
              >
                <span className="text-muted-foreground">
                  {new Date(result.completedAt).toLocaleString()}
                </span>
                <span className="font-mono">
                  {result.wpm} wpm · {result.accuracy}% · {result.difficulty} ·{" "}
                  {result.duration}s
                </span>
              </li>
            ))}
          </ol>

          <Link href="/" className={cn(buttonVariants(), "mt-8 inline-flex")}>
            Back to typing
          </Link>
        </section>

        <AppFooter />
      </div>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2 font-mono text-3xl">{value}</p>
    </div>
  );
}
