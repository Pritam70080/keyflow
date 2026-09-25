"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TypingResult } from "@/lib/typing/types";

interface ProgressChartProps {
  results: TypingResult[];
}

export function ProgressChart({ results }: ProgressChartProps) {
  const data = useMemo(
    () =>
      [...results].reverse().map((result, index) => ({
        index: index + 1,
        wpm: result.wpm,
        accuracy: result.accuracy,
        date: new Date(result.completedAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
      })),
    [results],
  );

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Complete a test to see your speed trend here.
      </p>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--foreground)",
            }}
          />
          <Area
            type="monotone"
            dataKey="wpm"
            stroke="var(--accent)"
            fill="var(--accent)"
            fillOpacity={0.18}
            strokeWidth={2}
            name="WPM"
          />
          <Area
            type="monotone"
            dataKey="accuracy"
            stroke="var(--success)"
            fill="var(--success)"
            fillOpacity={0.1}
            strokeWidth={2}
            name="Accuracy"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
